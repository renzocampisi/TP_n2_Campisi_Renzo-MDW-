// Middleware reutilizable: valida req.body con el schema de Zod que se le pase.
import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    // Datos invalidos -> 400 con un mensaje claro y el detalle por campo.
    if (!result.success) {
      const { fieldErrors, formErrors } = result.error.flatten();
      res.status(400).json({
        // formErrors son errores generales (ej: "Hay que enviar al menos un campo para editar").
        error: formErrors[0] ?? "Los datos enviados no son validos",
        details: fieldErrors,
      });
      return;
    }

    // Reemplazamos el body por la version ya validada (con la fecha convertida, sin espacios, etc).
    req.body = result.data;
    next();
  };
}
