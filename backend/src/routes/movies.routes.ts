// Rutas RESTful del recurso "movies" (en plural, como pide el TP).
import { Router } from "express";
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movies.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.js";
import { createMovieSchema, updateMovieSchema } from "../schemas/movie.schema.js";

const router = Router();

// Lectura: rutas PUBLICAS (cualquiera puede ver el catalogo).
router.get("/", getMovies);
router.get("/:id", getMovieById);

// Escritura: protegidas con authMiddleware (401 sin sesion) + requireRole("admin") (403 sin permisos).
// Despues validamos el body con Zod (400 si los datos estan mal).
router.post("/", authMiddleware, requireRole("admin"), validateBody(createMovieSchema), createMovie);
router.put("/:id", authMiddleware, requireRole("admin"), validateBody(updateMovieSchema), updateMovie);
router.patch("/:id", authMiddleware, requireRole("admin"), validateBody(updateMovieSchema), updateMovie);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteMovie);

export default router;
