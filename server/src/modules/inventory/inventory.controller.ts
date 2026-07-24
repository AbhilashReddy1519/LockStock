import { Response, Request } from "express";
import { error, success } from "../../utils/response.js";
import { inventoryService } from "./inventory.service.js";


export async function addQuantity(req: Request, res: Response) {
  const id = req.params.id as string;
  const { quantity } = req.body;
  if(!id) return error(res, 400, "Product ID required");
  if (quantity === undefined || quantity === null) {
    return error(res, 400, "Quantity is required");
  }
  if (quantity <= 0) {
    return error(res, 400, "Quantity must be greater than 0");
  }

  await inventoryService.addQuantity(id, quantity);
  return success(res, 200, "Quantity updated successfully");
}

export async function getInventory(req: Request, res: Response) {
  const inventoryItems = await inventoryService.getInventory();
  return success(res, 200, "Inventory Items", inventoryItems);
}