import { z } from "zod";

export const UserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string()
});

export type User = z.infer<typeof UserSchema>;
