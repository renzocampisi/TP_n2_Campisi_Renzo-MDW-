// Pagina de login: con email/contraseña o con GitHub.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { signIn, useSession } from "../lib/auth-client";
import { FormField } from "../components/FormField";

export const Login = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  // React Hook Form + Zod: zodResolver valida con el schema antes de llamar a onSubmit.
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // A donde volver despues del login (si venia de una ruta protegida).
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  // Si el login con GitHub falla, Better Auth vuelve a /login?error=...
  const githubError = new URLSearchParams(location.search).get("error");

  // Si ya tiene sesion no tiene sentido mostrar el login.
  if (session) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    // Better Auth no tira excepciones: devuelve { data, error }.
    const { error } = await signIn.email(values);
    if (error) {
      setError("root", { message: "Email o contraseña incorrectos" });
      return;
    }
    navigate(from, { replace: true });
  };

  // Login con GitHub: redirige a GitHub y al volver Better Auth crea la sesion.
  const handleGithub = () =>
    signIn.social({ provider: "github", callbackURL: from, errorCallbackURL: "/login" });

  return (
    <section className="mx-auto w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-semibold">Iniciar sesion</h1>

      {githubError && (
        <p role="alert" className="mb-4 rounded bg-amber-50 p-3 text-sm text-amber-900">
          No se pudo iniciar sesion con GitHub.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
        <FormField label="Email" type="email" autoComplete="email" registration={register("email")} error={errors.email} />
        <FormField
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          registration={register("password")}
          error={errors.password}
        />
        {errors.root && (
          <p role="alert" className="text-sm text-red-700">
            {errors.root.message}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-brand-600 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="my-4 text-center text-sm text-slate-600">o</p>

      <button
        type="button"
        onClick={handleGithub}
        className="w-full rounded border border-slate-400 py-2 font-medium hover:bg-slate-100"
      >
        Entrar con GitHub
      </button>

      <p className="mt-4 text-center text-sm text-slate-700">
        ¿No tenes cuenta?{" "}
        <Link to="/register" className="font-medium text-brand-700 underline">
          Registrate
        </Link>
      </p>
    </section>
  );
};
