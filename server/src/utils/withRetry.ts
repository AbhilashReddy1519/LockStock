import { AppError } from "./AppError.js";

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3
): Promise<T> {
  let attempts = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempts++;

      const err = error as { code?: string };
      const isDeadLock = err.code === "40P01";
      const isOptimisticConflict =
        error instanceof AppError &&
        error.message === "Optimistic lock conflict";
        
      if ((isDeadLock || isOptimisticConflict) && attempts < retries) {
        await new Promise((resolve) => {
          setTimeout(resolve, attempts * 50);
        });

        continue;
      }

      throw error;
    }
  }
}
