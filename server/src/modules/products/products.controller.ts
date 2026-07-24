import { Request, Response } from "express";
import { success } from "../../utils/response.js";
import { productService } from "./products.service.js";

export async function createProduct(
  req: Request, res: Response
) {
  const {name, price} = req.body;

  const product = await productService.create(name, price);
  return success(res, 201, "Product created successfully", product)
}

export async function getProducts(req: Request, res: Response) {
  const products = await productService.getAll();
  return success(res, 200, "All Products", products);
}

