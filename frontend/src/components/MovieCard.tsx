// Tarjeta de una pelicula en el listado.
import { Link } from "react-router";
import type { Movie } from "../types/movie";
import { formatDate, formatDuration } from "../utils/format";

export const MovieCard = ({ movie }: { movie: Movie }) => (
  <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-lg font-semibold">{movie.title}</h2>
    <p className="text-sm text-slate-700">{movie.director}</p>
    <p className="mt-2 text-sm text-slate-700">
      {movie.genre} · {formatDuration(movie.duration)} · {formatDate(movie.releaseDate)}
    </p>
    <p className={`mt-2 text-sm font-medium ${movie.available ? "text-green-700" : "text-slate-600"}`}>
      {movie.available ? "Disponible" : "No disponible"}
    </p>
    <Link
      to={`/movies/${movie._id}`}
      className="mt-4 self-start text-sm font-medium text-brand-700 underline"
      aria-label={`Ver detalle de ${movie.title}`}
    >
      Ver detalle
    </Link>
  </article>
);
