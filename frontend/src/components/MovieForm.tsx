// Formulario para crear o editar una pelicula (React Hook Form + Zod).
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "../lib/api";
import { emptyMovie, movieSchema, toMovieFormValues, type MovieFormValues } from "../schemas/movie.schema";
import type { Movie } from "../types/movie";
import { FormField } from "./FormField";

interface MovieFormProps {
  movie: Movie | null; // null = crear, con pelicula = editar
  onSave: (values: MovieFormValues) => Promise<void>;
  onCancel: () => void;
}

export const MovieForm = ({ movie, onSave, onCancel }: MovieFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    // "values" actualiza el formulario cuando cambia la pelicula que se esta editando.
    values: movie ? toMovieFormValues(movie) : emptyMovie,
  });

  const onSubmit = async (values: MovieFormValues) => {
    try {
      await onSave(values);
      reset(emptyMovie); // limpiamos el formulario despues de guardar
    } catch (err) {
      // Error del backend (ej: 400, 403) -> se muestra debajo del formulario.
      setError("root", { message: getErrorMessage(err) });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold">{movie ? `Editando: ${movie.title}` : "Nueva pelicula"}</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Titulo" registration={register("title")} error={errors.title} />
        <FormField label="Director" registration={register("director")} error={errors.director} />
        <FormField label="Genero" registration={register("genre")} error={errors.genre} />
        <FormField
          label="Duracion (minutos)"
          type="number"
          min={1}
          registration={register("duration", { valueAsNumber: true })}
          error={errors.duration}
        />
        <FormField label="Fecha de estreno" type="date" registration={register("releaseDate")} error={errors.releaseDate} />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" {...register("available")} className="h-4 w-4" />
        Disponible
      </label>

      {errors.root && (
        <p role="alert" className="text-sm text-red-700">
          {errors.root.message}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isSubmitting ? "Guardando..." : movie ? "Guardar cambios" : "Crear pelicula"}
        </button>
        {movie && (
          <button type="button" onClick={onCancel} className="rounded border border-slate-400 px-4 py-2 hover:bg-slate-100">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
