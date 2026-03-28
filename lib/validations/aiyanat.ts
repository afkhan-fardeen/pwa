import { z } from "zod";

/** Monthly yes / no only; amount is stored as 0 in the database. */
export const aiyanatUpsertSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Use YYYY-MM"),
  contributed: z.boolean(),
});

export type AiyanatUpsertInput = z.infer<typeof aiyanatUpsertSchema>;
