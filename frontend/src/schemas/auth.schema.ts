// Validaciones de los formularios de login y registro (React Hook Form + Zod).
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "El email no tiene un formato valido" }).trim().toLowerCase(),
  password: z.string().min(1, { error: "La contraseña es obligatoria" }),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, { error: "El nombre debe tener al menos 2 letras" }).max(80),
  email: z.email({ error: "El email no tiene un formato valido" }).trim().toLowerCase(),
  // Better Auth pide minimo 8 caracteres.
  password: z.string().min(8, { error: "La contraseña debe tener al menos 8 caracteres" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
