import { Request, Response } from "express";
import { orderService } from "./order.service.js";
import { success } from "../../utils/response.js";

export async function createOrder(req: Request, res: Response) {
  const { items } = req.body;
  const order = orderService.createOrder(items);
  return success(res, 201, "Order Created Successfully", order);
}
