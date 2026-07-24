import { Router } from "express";
import productRouter from "../modules/products/products.route.js";
import inventoryRouter from "../modules/inventory/inventory.route.js";
import orderRouter from "../modules/orders/order.route.js";

const router = Router();

router.use("/product", productRouter);
router.use("/inventory", inventoryRouter);
router.use("/order", orderRouter);

export default router;
