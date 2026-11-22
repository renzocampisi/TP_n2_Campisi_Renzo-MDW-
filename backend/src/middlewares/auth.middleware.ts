// Middlewares de seguridad para proteger las rutas de escritura.
import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { UserRole } from "../types/auth.types.js";

// authMiddleware: verifica que haya una sesion iniciada.
// Better Auth lee la cookie de sesion y la busca en Mongo.
export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

    // Sin sesion -> 401 (no autenticado).
    if (!session) {
      res.status(401).json({ error: "Tenes que iniciar sesion" });
      return;
    }

    // Guardamos el usuario para usarlo en el siguiente middleware (requireRole).
    req.user = session.user;
    next();
  } catch (error) {
    console.error("[auth] error leyendo la sesion:", error);
    res.status(500).json({ error: "No se pudo verificar la sesion" });
  }
}

// requireRole: se usa SIEMPRE despues de authMiddleware. Verifica que el rol del usuario este permitido.
// Ejemplo: requireRole("admin") -> solo los admin pueden pasar.
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Tenes que iniciar sesion" });
      return;
    }

    // Tiene sesion pero no el rol necesario -> 403 (sin permisos).
    if (!allowedRoles.includes(req.user.role as UserRole)) {
      res.status(403).json({ error: "No tenes permisos para realizar esta accion" });
      return;
    }

    next();
  };
}
