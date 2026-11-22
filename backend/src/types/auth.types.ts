import type { auth } from "../lib/auth.js";

// Tipo del usuario de la sesion, inferido de la config de Better Auth (incluye "role").
type Session = typeof auth.$Infer.Session;
export type SessionUser = Session["user"];

// Los dos roles del TP: "user" (solo lee) y "admin" (crea, edita y elimina).
export type UserRole = "admin" | "user";

// Agregamos "user" al Request de Express para poder usar req.user en los controllers.
declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}
