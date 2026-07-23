import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { env } from "./config/env.js";

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`
    ===================================
    Inventory Service Started
    Environment : ${process.env.NODE_ENV || "development"}
    Port        : ${PORT}
    ===================================
  `);
});

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("Stopping server...");
  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("Stopping server...");
  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});
