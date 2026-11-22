// Panel de admin: ABM (alta, baja y modificacion) de peliculas. Solo accesible con rol "admin".
import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../lib/api";
import type { Movie, MoviesResponse } from "../types/movie";
import type { MovieFormValues } from "../schemas/movie.schema";
import { MovieForm } from "../components/MovieForm";
import { formatDate } from "../utils/format";

export const Admin = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editing, setEditing] = useState<Movie | null>(null); // pelicula que se esta editando
  const [error, setError] = useState("");

  // Trae todas las peliculas (limit 50 = maximo que permite el backend).
  const loadMovies = () => {
    api
      .get<MoviesResponse>("/movies", { params: { limit: 50 } })
      .then((res) => setMovies(res.data.data))
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(() => {
    loadMovies();
  }, []);

  // Crear (POST) o editar (PUT). Si falla, el error lo muestra el formulario.
  const handleSave = async (values: MovieFormValues) => {
    if (editing) {
      await api.put(`/movies/${editing._id}`, values);
      setEditing(null);
    } else {
      await api.post("/movies", values);
    }
    loadMovies();
  };

  // Eliminar (DELETE) con confirmacion.
  const handleDelete = async (movie: Movie) => {
    if (!window.confirm(`¿Eliminar "${movie.title}"?`)) return;
    try {
      await api.delete(`/movies/${movie._id}`);
      if (editing?._id === movie._id) setEditing(null);
      loadMovies();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Panel de administracion</h1>

      <MovieForm movie={editing} onSave={handleSave} onCancel={() => setEditing(null)} />

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
        {movies.map((movie) => (
          <li key={movie._id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-medium">{movie.title}</p>
              <p className="text-sm text-slate-700">
                {movie.director} · {movie.genre} · {formatDate(movie.releaseDate)} ·{" "}
                {movie.available ? "Disponible" : "No disponible"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(movie)}
                className="rounded border border-slate-400 px-3 py-1 text-sm hover:bg-slate-100"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(movie)}
                className="rounded border border-red-400 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
        {movies.length === 0 && <li className="px-4 py-3 text-sm text-slate-700">Todavia no hay peliculas cargadas.</li>}
      </ul>
    </section>
  );
};
