import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  type: z.enum(["CURRENT", "SAVINGS"]),
  balance: z.string().min(1, "Enter your initial balance"),
  isDefault: z.boolean().default(false),
});
