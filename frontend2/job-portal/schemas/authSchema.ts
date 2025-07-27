// schemas/authSchemas.ts
import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string(),
  role: z.enum(["USER", "ADMIN"]).optional() // Optional or default to USER
});

export const SignInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
