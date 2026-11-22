// Punto de entrada del backend.
// dotenv va PRIMERO: lib/auth.ts lee las variables de entorno apenas se importa.
import "dotenv/config";
import express, { Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { connectMongoDB } from "./config/db.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// No hace falta CORS: el front llama a /api en su mismo origen
// (proxy de Vite en local y rewrite del Static Site en Render).

// IMPORTANTE: Better Auth va ANTES de express.json() porque lee el body crudo.
// "*splat" es el comodin de Express 5 -> atiende todo /api/auth/... (login, registro, logout, GitHub).
app.all("/api/auth/*splat", toNodeHandler(auth));

// A partir de aca el body JSON queda parseado en req.body.
app.use(express.json());

// Ruta para chequear que el servidor esta vivo (util en Render).
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Primero conectamos a Mongo y despues levantamos el servidor.
async function startServer(): Promise<void> {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("[server] no se pudo iniciar:", error);
  process.exit(1);
});
