// Conexion a MongoDB con Mongoose (la usan los modelos, ej: Movie).
import mongoose from "mongoose";

export async function connectMongoDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  // Si falta la variable cortamos con un error claro en vez de fallar mas adelante.
  if (!uri) {
    throw new Error("Falta la variable MONGODB_URI. Revisar el archivo .env (ver .env.example)");
  }

  await mongoose.connect(uri);
  console.log("[mongodb] conectado");
}
