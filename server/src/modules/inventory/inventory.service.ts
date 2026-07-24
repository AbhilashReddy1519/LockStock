import { eq, sql } from "drizzle-orm";
import { db } from "../../config/db/index.js";
import { inventory, products } from "../../config/db/schema.js";
import { AppError } from "../../utils/AppError.js";

export const inventoryService = {
  addQuantity: async (productId: string, quantity: number) => {
    const [product] = await db
      .update(inventory)
      .set({
        quantity: sql`${inventory.quantity} + ${quantity}`,
      })
      .where(eq(inventory.productId, productId))
      .returning();

    if (!product) {
      throw new AppError(404, "Product not found");
    }
  },

  getInventory: async () => {
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        quantity: inventory.quantity,
        version: inventory.version,
      })
      .from(inventory)
      .innerJoin(products, eq(inventory.productId, products.id));

    return result;
  },
};
