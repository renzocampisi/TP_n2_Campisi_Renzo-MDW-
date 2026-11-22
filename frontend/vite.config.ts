import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // IMPORTANTE: en local, todo lo que empiece con /api se reenvia al backend (puerto 3000).
  // Es el mismo truco que el rewrite /api/* de Render: para el navegador front y back
  // tienen el mismo origen, asi la cookie de sesion viaja sola y no hace falta CORS.
  server: {
    proxy: { "/api": "http://localhost:3000" },
  },
});
