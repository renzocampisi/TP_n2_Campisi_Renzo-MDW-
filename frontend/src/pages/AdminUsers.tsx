// Pagina de admin para cambiar roles (opcional del TP).
// Usa los endpoints del plugin admin de Better Auth: listUsers y setRole. No hace falta codigo en el backend.
import { useEffect, useState } from "react";
import { authClient, useSession } from "../lib/auth-client";
import type { UserRole } from "../types/movie";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role?: string | null;
}

export const AdminUsers = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    const { data, error } = await authClient.admin.listUsers({ query: { limit: 100 } });
    if (error) {
      setError(error.message ?? "No se pudieron cargar los usuarios");
      return;
    }
    setUsers(data.users);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Cambia el rol de un usuario con authClient.admin.setRole.
  const changeRole = async (userId: string, role: UserRole) => {
    const { error } = await authClient.admin.setRole({ userId, role });
    if (error) {
      setError(error.message ?? "No se pudo cambiar el rol");
      return;
    }
    loadUsers();
  };

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Usuarios y roles</h1>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
        {users.map((user) => (
          <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-slate-700">{user.email}</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              Rol
              <select
                value={user.role ?? "user"}
                onChange={(e) => changeRole(user.id, e.target.value as UserRole)}
                // Un admin no puede quitarse el rol a si mismo (para no quedarse afuera del panel).
                disabled={user.id === session?.user.id}
                className="rounded border border-slate-400 bg-white px-2 py-1 disabled:opacity-60"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
};
