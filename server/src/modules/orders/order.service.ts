import { and, eq, sql } from "drizzle-orm";
import { db } from "../../config/db/index.js";
import { inventory, orderItems, orders } from "../../config/db/schema.js";
import { AppError } from "../../utils/AppError.js";
import { withRetry } from "../../utils/withRetry.js";

type orderItem = {
  productId: string;
  quantity: number;
};

export const orderService = {
  createOrderPessimistic: async (items: orderItem[]) => {
    return await db.transaction(async (tx) => {
      // create order
      const [order] = await tx.insert(orders).values({}).returning();

      // avoid race condition so sort
      items.sort((a, b) => a.productId.localeCompare(b.productId));

      for (const item of items) {
        const result = await tx.execute(sql`
            SELECT product_id, quantity
            FROM inventory
            WHERE product_id = ${item.productId}
            FOR UPDATE
          `);

        if (result.rows.length === 0)
          throw new AppError(404, "Product not found.");
        const stock = result.rows[0] as {
          quantity: number;
        };

        if (stock.quantity < item.quantity) {
          throw new AppError(400, "Insufficient stock");
        }

        await tx.execute(sql`
            UPDATE inventory
            SET quantity = quantity - ${item.quantity},
              version = version + 1
            WHERE product_id = ${item.productId}
          `);

        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      return order;
    });
  },

  createOrderOptimistic: async (items: orderItem[]) => {
    return withRetry(async () => {
      return await db.transaction(async (tx) => {
        const [order] = await tx.insert(orders).values({}).returning();

        for(const item of items) {
          const stock = await tx.query.inventory.findFirst({
            where: eq(inventory.productId, item.productId),
          });

          if(!stock) {
            throw new AppError(404, "Product not found");
          }

          if(stock.quantity < item.quantity) {
            throw new AppError(400, "Insufficient stock");
          }

          const updated = await tx
            .update(inventory)
            .set({
              quantity: stock.quantity - item.quantity,
              version: stock.version + 1,
            })
            .where(and(
              eq(inventory.productId, stock.productId),
              eq(inventory.version, stock.version)
            ))
            .returning()

          if(updated.length === 0) {
            throw new AppError(409, "Optimistic lock conflict");
          }

          await tx.insert(orderItems).values({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
          });
        }

        return order;
      });
    });
  },

  createOrderAtomic: async (items: orderItem[]) => {
    return await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values({}).returning();
      for (const item of items) {
        const updated = await tx
          .update(inventory)
          .set({
            quantity: sql`${inventory.quantity} - ${item.quantity}`,
          })
          .where(
            sql`
              ${inventory.productId} = ${item.productId}
              AND ${inventory.quantity} >= ${item.quantity}
            `
          )
          .returning();

          if (updated.length === 0) {
            throw new AppError(400, "Insufficient stock or product not found");
          }
          await tx.insert(orderItems).values({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
          });
      }
      return order;
    })
  }
};

// The pattern above is excellent for learning row-level locking. However, in high-throughput systems, a more scalable approach is to avoid SELECT ... FOR UPDATE and use a single atomic conditional update:
