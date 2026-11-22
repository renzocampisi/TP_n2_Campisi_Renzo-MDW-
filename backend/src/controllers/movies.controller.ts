// Controller de peliculas: recibe el request, habla con la base (modelo Movie) y responde.
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Movie from "../models/Movie.js";

// GET /api/movies?search=texto&page=1&limit=6
// Listado con busqueda por titulo/director/genero y paginacion (opcional del TP).
export async function getMovies(req: Request, res: Response): Promise<void> {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 50);

    // Si hay texto de busqueda armamos un filtro con $or (busca en varios campos, sin importar mayusculas).
    let filter = {};
    if (search) {
      // Escapamos los caracteres especiales para que el texto no se interprete como una regex.
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter = {
        $or: [
          { title: { $regex: safeSearch, $options: "i" } },
          { director: { $regex: safeSearch, $options: "i" } },
          { genre: { $regex: safeSearch, $options: "i" } },
        ],
      };
    }

    // skip + limit = paginacion. countDocuments nos da el total para calcular las paginas.
    const movies = await Movie.find(filter)
      .sort({ releaseDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Movie.countDocuments(filter);

    res.status(200).json({
      data: movies,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[movies] error al listar:", error);
    res.status(500).json({ error: "No se pudieron obtener las peliculas" });
  }
}

// GET /api/movies/:id
export async function getMovieById(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = req.params;

  // Si el id no tiene formato de ObjectId de Mongo, ni siquiera consultamos la base.
  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "El id no es valido" });
    return;
  }

  try {
    const movie = await Movie.findById(id);

    // No existe -> 404.
    if (!movie) {
      res.status(404).json({ error: "Pelicula no encontrada" });
      return;
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error("[movies] error al buscar:", error);
    res.status(500).json({ error: "No se pudo obtener la pelicula" });
  }
}

// POST /api/movies (solo admin). El body ya llega validado por Zod.
export async function createMovie(req: Request, res: Response): Promise<void> {
  try {
    const movie = await Movie.create(req.body);
    // 201 = recurso creado.
    res.status(201).json(movie);
  } catch (error) {
    console.error("[movies] error al crear:", error);
    res.status(500).json({ error: "No se pudo crear la pelicula" });
  }
}

// PUT o PATCH /api/movies/:id (solo admin).
export async function updateMovie(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "El id no es valido" });
    return;
  }

  try {
    // new: true -> devuelve la pelicula ya actualizada. runValidators -> aplica las reglas del modelo.
    const movie = await Movie.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!movie) {
      res.status(404).json({ error: "Pelicula no encontrada" });
      return;
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error("[movies] error al editar:", error);
    res.status(500).json({ error: "No se pudo editar la pelicula" });
  }
}

// DELETE /api/movies/:id (solo admin).
export async function deleteMovie(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "El id no es valido" });
    return;
  }

  try {
    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      res.status(404).json({ error: "Pelicula no encontrada" });
      return;
    }

    // 204 = se borro y no hay nada para devolver.
    res.status(204).send();
  } catch (error) {
    console.error("[movies] error al eliminar:", error);
    res.status(500).json({ error: "No se pudo eliminar la pelicula" });
  }
}
