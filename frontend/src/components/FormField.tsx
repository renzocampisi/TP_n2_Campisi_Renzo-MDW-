// Campo de formulario reutilizable: label + input + mensaje de error.
// Usar <label> asociado al input mejora la accesibilidad (Lighthouse).
import type { InputHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  registration: UseFormRegisterReturn; // lo que devuelve register("campo")
  error?: FieldError;
}

export const FormField = ({ label, registration, error, ...inputProps }: FormFieldProps) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-slate-800">
    {label}
    <input
      {...inputProps}
      {...registration}
      aria-invalid={!!error}
      className="rounded border border-slate-400 bg-white px-3 py-2 font-normal aria-invalid:border-red-600"
    />
    {/* Error de validacion de Zod */}
    {error && <span className="text-xs text-red-700">{error.message}</span>}
  </label>
);
