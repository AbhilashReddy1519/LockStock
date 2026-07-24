import { Request, Response } from "express";
import { orderService } from "./order.service.js";
import { success } from "../../utils/response.js";

export async function createOrderPessimistic(req: Request, res: Response) {
  const { items } = req.body;
  const order = await orderService.createOrderPessimistic(items);
  return success(res, 201, "Order Created Successfully", order);
}

export async function createOrderOptimistic(req: Request, res: Response) {
  const { items } = req.body;
  const order = await orderService.createOrderOptimistic(items);
  return success(res, 201, "Order Created Successfully", order);
}

export async function createOrderAtomic(req: Request, res: Response) {
  const { items } = req.body;
  const order = await orderService.createOrderAtomic(items);
  return success(res, 201, "Order Created Successfully", order);
}
