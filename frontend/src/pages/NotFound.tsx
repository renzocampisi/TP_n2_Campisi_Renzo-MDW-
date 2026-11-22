import { Link } from "react-router";

// Se muestra para cualquier ruta que no exista.
export const NotFound = () => (
  <section className="text-center">
    <h1 className="text-3xl font-bold">404</h1>
    <p className="mt-2 text-slate-700">La pagina que buscas no existe.</p>
    <Link to="/" className="mt-4 inline-block font-medium text-brand-700 underline">
      Volver al catalogo
    </Link>
  </section>
);
