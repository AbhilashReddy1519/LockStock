import { db } from "../../config/db/index.js";
import { inventory, products } from "../../config/db/schema.js";
import { AppError } from "../../utils/AppError.js";

export const productService = {
  create: async (name: string, price: number) => {
    try {
      return await db.transaction(async (tx) => {
        const [product] = await tx
          .insert(products)
          .values({ name, price })
          .returning();

        await tx.insert(inventory).values({
          productId: product.id,
          quantity: 0,
        });

        return product;
      });
    } catch (error: any) {
      if (error.cause?.code === "23505") {
        throw new AppError(409, "Product already exists");
      }

      throw error;
    }
  },

  getAll: async () => {
    try {
      const products = await db.query.products.findMany({
        columns: {
          id: true,
          name: true,
          price: true,
        }
      });
      return products;
    } catch (error) {
      throw error;
    }
  }
};
