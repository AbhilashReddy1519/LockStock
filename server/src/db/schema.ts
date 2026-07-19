import { sql } from "drizzle-orm";
import { index, integer, pgEnum, pgTable, text, timestamp, unique, uniqueIndex, uuid } from "drizzle-orm/pg-core";

// --products
export const products = pgTable("products", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	price: integer("price").notNull(),
	// createdAt: timestamp("createdAt").defaultNow(),
	createdAt: timestamp("createdAt").default(sql`now()`),
});

// -- inventory (1:1 with products, separated for locking clarity)
export const inventory = pgTable("inventory", {
  productId: uuid("product_id").primaryKey()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  version: integer("version").notNull().default(0),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
  }).defaultNow(),
}, (table) => [
  sql`CHECK (${table.quantity} >= 0)`,
]);


// -- orders
export const orderStatusEnum = pgEnum("order_status", [
	"confirmed",
	"cancelled",
]);


export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: orderStatusEnum("status").notNull()
    .default("confirmed"),
  idempotencyKey: text("idempotency_key").unique(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow()
}, (table) => [
  uniqueIndex("idx_orders_idempontency_key")
    .on(table.idempotencyKey)
    .where(sql`${table.idempotencyKey} IS NOT NULL`),
]);

// -- order_items
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull()
    .references(() => orders.id),
  productId: uuid("product_id").notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull()
}, (table) => [
  sql`CHECK (${table.quantity} > 0)`,
  unique("order_items_order_products_unique").on(table.orderId, table.productId),
  index("idx_order_items_order_id").on(table.orderId),
  index("idx_order_items_product_id").on(table.productId),
])


// @deprecated — The third parameter of pgTable is changing and will only accept an array instead of an object

// @example
// Deprecated version:

// export const users = pgTable("users", {
//     id: integer(),
// }, (t) => ({
//     idx: index('custom_name').on(t.id)
// }));
// New API:

// export const users = pgTable("users", {
//     id: integer(),
// }, (t) => [
//     index('custom_name').on(t.id)
// ]);



