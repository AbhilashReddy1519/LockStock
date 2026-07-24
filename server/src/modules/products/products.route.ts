import { Router } from "express";
import { validateData } from "../../middleware/validate.middleware.js";
import { validateCreateProductSchema } from "../../validations/validation.js";
import { createProduct, getProducts } from "./products.controller.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getProducts));
router.post("/", validateData(validateCreateProductSchema), asyncHandler(createProduct));

export default router;