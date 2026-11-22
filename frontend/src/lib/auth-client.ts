// Cliente de Better Auth para React.
// Sin baseURL: usa el mismo origen del front (proxy de Vite en local, rewrite en Render).
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // adminClient habilita authClient.admin.listUsers y authClient.admin.setRole (pagina de roles).
  plugins: [adminClient()],
});

// useSession() pide /api/auth/get-session: por eso al recargar la pagina (F5) la sesion se mantiene.
export const { useSession, signIn, signUp, signOut } = authClient;
