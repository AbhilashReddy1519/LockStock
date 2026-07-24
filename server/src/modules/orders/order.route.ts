import {Router} from "express";
import { createOrderAtomic, createOrderOptimistic, createOrderPessimistic } from "./order.controller.js";

const router = Router();

router.post("/pessimistic", createOrderPessimistic);
router.post("/optimistic", createOrderOptimistic);
router.post("/atomic", createOrderAtomic);

export default router;