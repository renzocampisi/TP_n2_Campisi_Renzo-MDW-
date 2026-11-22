// Modelo de la entidad elegida: Pelicula.
// Cumple el requisito de minimo 4 campos con al menos 3 tipos distintos:
// texto (title, director, genre), numero (duration), fecha (releaseDate) y booleano (available).
import { Schema, model } from "mongoose";

export interface IMovie {
  title: string;
  director: string;
  genre: string;
  duration: number; // duracion en minutos
  releaseDate: Date; // fecha de estreno
  available: boolean; // si esta disponible en el catalogo
}

const movieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    director: { type: String, required: true, trim: true, maxlength: 80 },
    genre: { type: String, required: true, trim: true, maxlength: 40 },
    duration: { type: Number, required: true, min: 1, max: 600 },
    releaseDate: { type: Date, required: true },
    available: { type: Boolean, default: true },
  },
  {
    // Agrega createdAt y updatedAt automaticamente.
    timestamps: true,
  }
);

const Movie = model<IMovie>("Movie", movieSchema);

export default Movie;
