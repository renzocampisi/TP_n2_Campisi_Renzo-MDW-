// Validacion del formulario de peliculas (mismas reglas que el Zod del backend).
import { z } from "zod";
import type { Movie } from "../types/movie";

export const movieSchema = z.object({
  title: z.string().trim().min(1, { error: "El titulo es obligatorio" }).max(120, { error: "Maximo 120 caracteres" }),
  director: z.string().trim().min(1, { error: "El director es obligatorio" }).max(80, { error: "Maximo 80 caracteres" }),
  genre: z.string().trim().min(1, { error: "El genero es obligatorio" }).max(40, { error: "Maximo 40 caracteres" }),
  // El input numerico se registra con valueAsNumber, si queda vacio llega NaN -> mensaje de error.
  duration: z
    .number({ error: "La duracion es obligatoria" })
    .int({ error: "Debe ser un numero entero" })
    .min(1, { error: "Minimo 1 minuto" })
    .max(600, { error: "Maximo 600 minutos" }),
  // El input type="date" devuelve "AAAA-MM-DD".
  releaseDate: z.string().min(1, { error: "La fecha de estreno es obligatoria" }),
  available: z.boolean(),
});

export type MovieFormValues = z.infer<typeof movieSchema>;

// Valores del formulario vacio (para "Nueva pelicula").
export const emptyMovie: MovieFormValues = {
  title: "",
  director: "",
  genre: "",
  duration: 90,
  releaseDate: "",
  available: true,
};

// Convierte una pelicula del backend a los valores del formulario (para "Editar").
export const toMovieFormValues = (movie: Movie): MovieFormValues => ({
  title: movie.title,
  director: movie.director,
  genre: movie.genre,
  duration: movie.duration,
  releaseDate: movie.releaseDate.slice(0, 10), // "2014-08-21T00:00:00.000Z" -> "2014-08-21"
  available: movie.available,
});
