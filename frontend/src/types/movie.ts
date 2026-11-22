// Misma forma que el modelo Movie del backend (backend/src/models/Movie.ts).
export interface Movie {
  _id: string;
  title: string;
  director: string;
  genre: string;
  duration: number;
  releaseDate: string; // llega como texto ISO en el JSON
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

// Respuesta del listado paginado: GET /api/movies
export interface MoviesResponse {
  data: Movie[];
  total: number;
  page: number;
  totalPages: number;
}

// Los dos roles del sistema.
export type UserRole = "admin" | "user";
