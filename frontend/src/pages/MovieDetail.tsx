// Detalle de una pelicula (publico). El id sale de la URL: /movies/:id
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { api, getErrorMessage } from "../lib/api";
import type { Movie } from "../types/movie";
import { formatDate, formatDuration } from "../utils/format";

export const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Movie>(`/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch((err) => setError(getErrorMessage(err))); // ej: 404 "Pelicula no encontrada"
  }, [id]);

  if (error) {
    return (
      <section>
        <p role="alert" className="text-red-700">
          {error}
        </p>
        <Link to="/" className="mt-2 inline-block text-brand-700 underline">
          Volver al catalogo
        </Link>
      </section>
    );
  }

  if (!movie) {
    return <p className="text-slate-700">Cargando pelicula...</p>;
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <Link to="/" className="text-sm text-brand-700 underline">
        Volver al catalogo
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{movie.title}</h1>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
        <dt className="text-slate-600">Director</dt>
        <dd>{movie.director}</dd>
        <dt className="text-slate-600">Genero</dt>
        <dd>{movie.genre}</dd>
        <dt className="text-slate-600">Duracion</dt>
        <dd>{formatDuration(movie.duration)}</dd>
        <dt className="text-slate-600">Estreno</dt>
        <dd>{formatDate(movie.releaseDate)}</dd>
        <dt className="text-slate-600">Estado</dt>
        <dd className={movie.available ? "text-green-700" : "text-slate-600"}>
          {movie.available ? "Disponible" : "No disponible"}
        </dd>
      </dl>
    </article>
  );
};
