import { z } from "zod";
import { registerSchema } from "@/lib/validations/register";
import { newPasswordSchema, requestResetSchema } from "@/lib/validations/password-reset";

export const loginFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordFormSchema = z
  .object({
    password: newPasswordSchema,
    confirm: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export { registerSchema, requestResetSchema, newPasswordSchema };

export type LoginFormValues = z.infer<typeof loginFormSchema>;

/** First error message per field from Zod flatten. */
export function fieldErrorsFromZod(
  err: z.ZodError,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) {
      out[key] = issue.message;
    }
  }
  return out;
}
