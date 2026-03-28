import { z } from "zod";

export const newPasswordSchema = z
  .string()
  .min(8, "Minimum 8 characters")
  .regex(/[0-9]/, "Include at least one number");

export const requestResetSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});
