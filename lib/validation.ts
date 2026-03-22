import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const progressSchema = z.object({
  last_position_seconds: z.number().int().nonnegative().optional(),
  is_completed: z.boolean().optional(),
});
