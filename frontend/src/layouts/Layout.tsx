// Estructura comun de todas las paginas: header con navegacion + contenido (<Outlet />).
import { Link, NavLink, Outlet } from "react-router";
import { signOut, useSession } from "../lib/auth-client";

// Clase de los links del menu (resalta el activo).
const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded px-3 py-2 text-sm font-medium hover:bg-white/10 ${isActive ? "bg-white/15" : ""}`;

export const Layout = () => {
  const { data: session } = useSession();
  const user = session?.user;

  // Logout: signOut borra la sesion en la base. Recargamos para limpiar todo el estado.
  const handleLogout = async () => {
    await signOut();
    window.location.replace("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <header className="bg-brand-900 text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-xl font-bold">
            CineTeca
          </Link>
          <nav aria-label="Navegacion principal" className="flex flex-wrap items-center gap-1">
            <NavLink to="/" end className={navClass}>
              Catalogo
            </NavLink>
            {/* El link al panel solo se muestra a los admin */}
            {user?.role === "admin" && (
              <>
                <NavLink to="/admin" end className={navClass}>
                  Admin
                </NavLink>
                <NavLink to="/admin/usuarios" className={navClass}>
                  Usuarios
                </NavLink>
              </>
            )}
            {user ? (
              <button type="button" onClick={handleLogout} className={navClass({ isActive: false })}>
                Salir ({user.name})
              </button>
            ) : (
              <NavLink to="/login" className={navClass}>
                Ingresar
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="py-4 text-center text-sm text-slate-600">
        TP N°2 - Metodologia de Desarrollo Web 2026 - Renzo Campisi
      </footer>
    </div>
  );
};
