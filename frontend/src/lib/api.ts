import axios from "axios";

// IMPORTANTE: usamos una ruta RELATIVA (/api), nunca la URL del backend.
// En local la resuelve el proxy de Vite y en Render el rewrite /api/* del Static Site.
export const api = axios.create({
  baseURL: "/api",
});

// Saca un mensaje de error legible de lo que devuelva el backend ({ error: "..." }).
export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error ?? err.message;
  }
  return "Ocurrio un error inesperado";
};
