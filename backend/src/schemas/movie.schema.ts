// Validacion con Zod para crear y editar peliculas.
// Si los datos no cumplen, el middleware validateBody responde 400 con los errores de cada campo.
import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().trim().min(1, "El titulo es obligatorio").max(120, "Maximo 120 caracteres"),
  director: z.string().trim().min(1, "El director es obligatorio").max(80, "Maximo 80 caracteres"),
  genre: z.string().trim().min(1, "El genero es obligatorio").max(40, "Maximo 40 caracteres"),
  duration: z
    .number({ error: "La duracion debe ser un numero" })
    .int("La duracion debe ser un numero entero")
    .min(1, "La duracion minima es 1 minuto")
    .max(600, "La duracion maxima es 600 minutos"),
  // z.coerce.date() convierte el string "2024-05-10" que manda el front en un Date.
  releaseDate: z.coerce.date({ error: "La fecha de estreno no es valida" }),
  available: z.boolean().optional(),
});

// Para editar todos los campos son opcionales (sirve para PUT y PATCH), pero tiene que venir al menos uno.
export const updateMovieSchema = createMovieSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Hay que enviar al menos un campo para editar" }
);

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
