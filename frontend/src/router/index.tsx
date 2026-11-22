// Todas las rutas del front en un solo lugar.
import { createBrowserRouter } from "react-router";
import { Layout } from "../layouts/Layout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Home } from "../pages/Home";
import { MovieDetail } from "../pages/MovieDetail";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Admin } from "../pages/Admin";
import { AdminUsers } from "../pages/AdminUsers";
import { NotFound } from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // Rutas publicas: listado y detalle.
      { index: true, element: <Home /> },
      { path: "movies/:id", element: <MovieDetail /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // Rutas protegidas por ROL: solo admin. Un usuario comun ve "sin permisos".
      {
        element: <ProtectedRoute role="admin" />,
        children: [
          { path: "admin", element: <Admin /> },
          { path: "admin/usuarios", element: <AdminUsers /> },
        ],
      },

      // Cualquier otra ruta -> pagina 404.
      { path: "*", element: <NotFound /> },
    ],
  },
]);
