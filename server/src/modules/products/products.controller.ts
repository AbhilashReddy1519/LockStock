import { Request, Response } from "express";

export async function createProduct(
  req: Request, res: Response
) {
  const product:Product = req.body;
}