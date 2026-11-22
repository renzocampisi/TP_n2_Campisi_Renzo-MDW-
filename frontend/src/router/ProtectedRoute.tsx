// Protege rutas: pide sesion iniciada y, opcionalmente, un rol.
import { Link, Navigate, Outlet, useLocation } from "react-router";
import { useSession } from "../lib/auth-client";
import type { UserRole } from "../types/movie";

interface ProtectedRouteProps {
  role?: UserRole;
}

export const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  // isPending es true mientras se consulta la sesion al backend (por ejemplo, despues de un F5).
  const { data: session, isPending } = useSession();
  const location = useLocation();

  if (isPending) {
    return <p className="text-slate-600">Verificando sesion...</p>;
  }

  // Sin sesion -> al login, guardando a donde queria ir para volver despues.
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Con sesion pero sin el rol necesario -> mensaje de "sin permisos".
  if (role && session.user.role !== role) {
    return (
      <section className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
        <h1 className="text-xl font-semibold">Sin permisos</h1>
        <p className="mt-2">Esta seccion es solo para administradores.</p>
        <Link to="/" className="mt-4 inline-block font-medium underline">
          Volver al catalogo
        </Link>
      </section>
    );
  }

  // Todo OK -> se muestra la ruta hija.
  return <Outlet />;
};
