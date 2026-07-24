import {z} from 'zod';

export const validateCreateProductSchema = z.object({
  name: z.string(),
  price: z.number(),
});