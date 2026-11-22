// Pagina principal (publica): listado de peliculas con busqueda y paginacion.
import { useEffect, useState, type FormEvent } from "react";
import { api, getErrorMessage } from "../lib/api";
import type { MoviesResponse } from "../types/movie";
import { MovieCard } from "../components/MovieCard";

export const Home = () => {
  const [result, setResult] = useState<MoviesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState(""); // lo que se escribe en el input
  const [search, setSearch] = useState(""); // lo que se busca de verdad (al enviar)

  // Cada vez que cambia la pagina o la busqueda, pedimos el listado al backend.
  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get<MoviesResponse>("/movies", { params: { page, search, limit: 6 } })
      .then((res) => setResult(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1); // al buscar volvemos a la primera pagina
    setSearch(searchText.trim());
  };

  return (
    <section>
      <h1 className="text-2xl font-bold">Catalogo de peliculas</h1>

      {/* Buscador (opcional del TP) */}
      <form onSubmit={handleSearch} role="search" className="mt-4 flex gap-2">
        <label htmlFor="search" className="sr-only">
          Buscar por titulo, director o genero
        </label>
        <input
          id="search"
          type="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Buscar por titulo, director o genero"
          className="w-full rounded border border-slate-400 bg-white px-3 py-2"
        />
        <button type="submit" className="rounded bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">
          Buscar
        </button>
      </form>

      {loading && <p className="mt-6 text-slate-700">Cargando peliculas...</p>}
      {error && (
        <p role="alert" className="mt-6 text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && result && (
        <>
          {result.data.length === 0 ? (
            <p className="mt-6 text-slate-700">No se encontraron peliculas.</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.data.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}

          {/* Paginacion (opcional del TP) */}
          {result.totalPages > 1 && (
            <nav aria-label="Paginacion" className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="rounded border border-slate-400 px-3 py-1 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm">
                Pagina {result.page} de {result.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(page + 1)}
                disabled={page >= result.totalPages}
                className="rounded border border-slate-400 px-3 py-1 disabled:opacity-50"
              >
                Siguiente
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
};
