// Configuracion de Better Auth: registro/login con email+contraseña y con GitHub.
// Los usuarios, sesiones y cuentas se guardan en NUESTRO Mongo (colecciones user, session, account).
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

// Lee una variable de entorno obligatoria. Si no esta, el servidor no arranca.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable ${name}. Revisar el archivo .env (ver .env.example)`);
  return value;
}

// Better Auth usa el driver nativo de Mongo (no Mongoose). Se conecta solo en la primera consulta.
const client = new MongoClient(requireEnv("MONGODB_URI"));

export const auth = betterAuth({
  // IMPORTANTE: es la URL del FRONT, porque el navegador llega al back a traves de /api (proxy/rewrite).
  // El secret se lee solo de la variable BETTER_AUTH_SECRET.
  baseURL: requireEnv("BETTER_AUTH_URL"),
  database: mongodbAdapter(client.db(), { client }),

  // Login con email y contraseña (minimo 8 caracteres por defecto).
  emailAndPassword: {
    enabled: true,
  },

  // Login con GitHub (OAuth App).
  socialProviders: {
    github: {
      clientId: requireEnv("GITHUB_CLIENT_ID"),
      clientSecret: requireEnv("GITHUB_CLIENT_SECRET"),
    },
  },

  // Si alguien registrado con email entra con GitHub (mismo email), se unen las cuentas.
  account: {
    accountLinking: { trustedProviders: ["github"] },
  },

  // Plugin admin: agrega el campo user.role ("user" por defecto a TODO usuario nuevo)
  // y endpoints como setRole y listUsers que usa el panel de admin.
  plugins: [admin()],
});
