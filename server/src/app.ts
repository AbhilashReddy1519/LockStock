import express, { Express, Response } from "express";
import cors from 'cors';
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import routes from "./routes/routes.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(compression());
app.use(morgan("dev"));

app.get("/health", (_, res:Response) => {
  res.status(200).json({
    success: true,
    service: "Inventory Service",
    status: "running....",
    timestamp: new Date().toISOString(),
  });
});


app.use("/api/v1", routes);
app.use(notFoundHandler);
// Global Error Handler
app.use(errorHandler);

export default app;