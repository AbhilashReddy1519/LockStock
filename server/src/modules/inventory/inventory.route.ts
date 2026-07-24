import {Router} from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addQuantity, getInventory } from "./inventory.controller.js";

const router = Router();

router.put("/:id", asyncHandler(addQuantity));
router.get("/", asyncHandler(getInventory))


export default router;