import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { error } from "../utils/response.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(err instanceof AppError) {
    return error(res, err.statusCode, err.message);
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
