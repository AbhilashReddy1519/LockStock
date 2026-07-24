import { sql } from "drizzle-orm"
import { db } from "../../config/db/index.js"
import { orderItems, orders } from "../../config/db/schema.js"
import { AppError } from "../../utils/AppError.js"

type orderItem = {
  productId: string,
  quantity: number,
}

export const orderService = {
  createOrder: async (items: orderItem[]) => {
    return await db.transaction(async (tx) => {
      // create order
      const [order] = await tx
        .insert(orders)
        .values({})
        .returning();

      // avoid race condition so sort 
      items.sort((a, b) => a.productId.localeCompare(b.productId));

      for(const item of items) {
        const result = await tx.execute(sql`
            SELECT product_id, quantity
            FROM inventory
            WHERE product_id = ${item.productId}
            FOR UPDATE
          `);
        
        if(result.rows.length === 0) throw new AppError(404, "Product not found.");
        const stock = result.rows[0] as {
          quantity: number,
        }

        if(stock.quantity < item.quantity) {
          throw new AppError(400, "Insufficient stock");
        }

        await tx.execute(sql`
            UPDATE inventory
            SET quantity = quantity - ${item.quantity},
              version = version + 1;
            WHERE product_id = ${item.productId}
          `);

        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      return order;
    })
  }
}


// The pattern above is excellent for learning row-level locking. However, in high-throughput systems, a more scalable approach is to avoid SELECT ... FOR UPDATE and use a single atomic conditional update: