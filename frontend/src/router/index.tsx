// Todas las rutas del front en un solo lugar.
import { createBrowserRouter } from "react-router";
import { Layout } from "../layouts/Layout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";

// RENDIMIENTO (Lighthouse): las paginas con formularios usan "lazy".
// Su codigo (React Hook Form, Zod, etc) se descarga recien cuando el usuario entra a esa ruta,
// asi la pagina principal carga mucho mas rapido.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // Rutas publicas: listado y detalle.
      { index: true, element: <Home /> },
      { path: "movies/:id", lazy: async () => ({ Component: (await import("../pages/MovieDetail")).MovieDetail }) },
      { path: "login", lazy: async () => ({ Component: (await import("../pages/Login")).Login }) },
      { path: "register", lazy: async () => ({ Component: (await import("../pages/Register")).Register }) },

      // Rutas protegidas por ROL: solo admin. Un usuario comun ve "sin permisos".
      {
        element: <ProtectedRoute role="admin" />,
        children: [
          { path: "admin", lazy: async () => ({ Component: (await import("../pages/Admin")).Admin }) },
          { path: "admin/usuarios", lazy: async () => ({ Component: (await import("../pages/AdminUsers")).AdminUsers }) },
        ],
      },

      // Cualquier otra ruta -> pagina 404.
      { path: "*", element: <NotFound /> },
    ],
  },
]);
