import { Router } from "express";
import productRouter from "../modules/products/products.route.js";

const router = Router();

router.use("/product", productRouter);

export default router;
