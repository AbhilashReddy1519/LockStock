import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../env.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool);
export { pool };


// Raw SQL
// import { pool } from "./db";
// const result = await pool.query("SELECT * FROM products");