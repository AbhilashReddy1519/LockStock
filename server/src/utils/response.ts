import { Response } from "express";

export function success(
  res: Response,
  status: number = 200,
  message: string,
  data?: unknown
) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

export function error(
  res: Response,
  status: number = 500,
  message: string,
  error?: unknown
) {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
}
