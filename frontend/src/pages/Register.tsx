// Pagina de registro. Todo usuario nuevo recibe el rol "user" (lo asigna el plugin admin del backend).
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schema";
import { signUp, useSession } from "../lib/auth-client";
import { FormField } from "../components/FormField";

export const Register = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  if (session) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values: RegisterFormValues) => {
    // signUp crea el usuario y ademas deja la sesion iniciada.
    const { error } = await signUp.email(values);
    if (error) {
      setError("root", { message: error.message ?? "No se pudo crear la cuenta" });
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <section className="mx-auto w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-semibold">Crear cuenta</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
        <FormField label="Nombre" autoComplete="name" registration={register("name")} error={errors.name} />
        <FormField label="Email" type="email" autoComplete="email" registration={register("email")} error={errors.email} />
        <FormField
          label="Contraseña"
          type="password"
          autoComplete="new-password"
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
          {isSubmitting ? "Creando..." : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-700">
        ¿Ya tenes cuenta?{" "}
        <Link to="/login" className="font-medium text-brand-700 underline">
          Ingresar
        </Link>
      </p>
    </section>
  );
};
