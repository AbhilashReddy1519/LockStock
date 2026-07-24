import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { error } from "../utils/response.js";

export function validateData<T>(schema: ZodType<T>) {
  return function(req: Request, res: Response, next: NextFunction, ) {
    const data = req.body;
    const result = schema.safeParse(data);
    if(!result.success) {
      return error(res, 404, "Validation failed", result.error.flatten());
    }

    req.body = result.data;
    next();
  }
}