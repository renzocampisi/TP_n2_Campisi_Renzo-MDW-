# CineTeca — TP N°2 MDW 2026

**Alumno:** Renzo Campisi
**Materia:** Metodología de Desarrollo Web 2026 — Trabajo final frontend + backend

Aplicación full stack para administrar un **catálogo de películas**. Cualquiera puede ver el listado y el
detalle de cada película; los usuarios con rol **admin** además pueden crear, editar y eliminar películas
y cambiar los roles de otros usuarios.

## Links

| | URL |
|---|---|
| Frontend (Render Static Site) | https://cineteca-front.onrender.com |
| Backend (Render Web Service) | https://cineteca-back.onrender.com |
| Repositorio | https://github.com/renzocampisi/TP_n2_Campisi_Renzo-MDW- |

> El backend está en el plan gratis de Render: si estuvo inactivo, la primera carga puede tardar ~50 segundos.

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| admin | admin@cineteca.com | Admin12345 |
| user | user@cineteca.com | User12345 |

---

## Entidad elegida: Película (`movies`)

| Campo | Tipo | Reglas |
|---|---|---|
| `title` | texto | obligatorio, máx. 120 caracteres |
| `director` | texto | obligatorio, máx. 80 caracteres |
| `genre` | texto | obligatorio, máx. 40 caracteres |
| `duration` | número | entero, entre 1 y 600 (minutos) |
| `releaseDate` | fecha | fecha de estreno, obligatoria |
| `available` | booleano | si está disponible (por defecto `true`) |

Además Mongoose agrega `createdAt` y `updatedAt`.

## Tecnologías

- **Backend:** Node 22, Express 5, TypeScript, MongoDB (Atlas) con Mongoose, Zod, Better Auth.
- **Frontend:** React 19, Vite, TypeScript, React Router, React Hook Form + Zod, Tailwind CSS, Axios.
- **Deploy:** Render (Web Service + Static Site).

## Estructura

```
backend/
  src/
    config/db.ts                 conexion a MongoDB
    lib/auth.ts                  configuracion de Better Auth (email, GitHub, plugin admin)
    middlewares/
      auth.middleware.ts         authMiddleware (401) y requireRole (403)
      validate.ts                validacion del body con Zod (400)
    models/Movie.ts              modelo de la entidad
    schemas/movie.schema.ts      schemas de Zod para crear y editar
    controllers/movies.controller.ts
    routes/movies.routes.ts
    server.ts
  .env.example
frontend/
  src/
    lib/                         axios (/api) y cliente de Better Auth
    router/                      rutas y ProtectedRoute (por rol)
    layouts/Layout.tsx           header con navegacion y logout
    pages/                       Home, MovieDetail, Login, Register, Admin, AdminUsers, NotFound
    components/                  MovieCard, MovieForm, FormField
    schemas/                     schemas de Zod de los formularios
```

---

## API

Base: `/api`. Las rutas de lectura son públicas; las de escritura piden sesión (**401** si no hay) y rol
admin (**403** si el usuario es común).

| Método | Ruta | Descripción | Rol requerido |
|---|---|---|---|
| GET | `/api/movies` | Listado. Query opcional: `search`, `page`, `limit` | Público |
| GET | `/api/movies/:id` | Detalle de una película | Público |
| POST | `/api/movies` | Crear película (responde **201**) | admin |
| PUT | `/api/movies/:id` | Editar película | admin |
| PATCH | `/api/movies/:id` | Editar parcialmente | admin |
| DELETE | `/api/movies/:id` | Eliminar película (responde **204**) | admin |
| * | `/api/auth/*` | Endpoints de Better Auth (registro, login, logout, GitHub, admin) | — |
| GET | `/health` | Estado del servidor | Público |

Códigos de respuesta:

- `200` OK · `201` creado · `204` eliminado
- `400` datos inválidos (Zod) o id con formato incorrecto. Ejemplo:
  ```json
  { "error": "Los datos enviados no son validos", "details": { "title": ["El titulo es obligatorio"] } }
  ```
- `401` sin sesión · `403` sin permisos · `404` película no encontrada · `500` error del servidor

Endpoints de Better Auth usados por el front:

| Método | Ruta | Uso |
|---|---|---|
| POST | `/api/auth/sign-up/email` | Registro (rol `user` por defecto) |
| POST | `/api/auth/sign-in/email` | Login con email y contraseña |
| POST | `/api/auth/sign-in/social` | Login con GitHub |
| GET | `/api/auth/callback/github` | Callback de GitHub |
| POST | `/api/auth/sign-out` | Logout |
| GET | `/api/auth/get-session` | Sesión actual (`useSession`) |
| GET | `/api/auth/admin/list-users` | Listar usuarios (admin) |
| POST | `/api/auth/admin/set-role` | Cambiar rol (admin) |

---

## Funcionalidades

**Requisitos mínimos**
- CRUD completo de películas con validación Zod y códigos HTTP correctos.
- Better Auth con email/contraseña y GitHub; usuarios y sesiones guardados en Mongo.
- Roles `user` (por defecto, solo lee) y `admin` (crea, edita y elimina), con `authMiddleware` + `requireRole("admin")`.
- Frontend con listado, detalle, login (email y GitHub), registro y logout.
- Panel de admin en ruta protegida por rol: un usuario común ve "Sin permisos".
- Formularios con React Hook Form + Zod mostrando los errores.
- La sesión se mantiene al recargar (`useSession()`).

**Opcionales**
- Búsqueda por título, director o género y paginación en el listado.
- Página de admin para cambiar roles (`authClient.admin.setRole`).

**Lighthouse**: 100 en Performance, Accessibility, Best Practices y SEO (carga diferida de páginas,
fuentes del sistema, `lang="es"`, meta description, labels en todos los inputs y buen contraste).

---

## Cómo correrlo en local

Requisitos: **Node 22** y una base de MongoDB Atlas.

### 1. Clonar

```bash
git clone https://github.com/renzocampisi/TP_n2_Campisi_Renzo-MDW-.git
cd TP_n2_Campisi_Renzo-MDW-
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env     # y completar los valores
npm run dev              # http://localhost:3000
```

Variables de entorno (`backend/.env`):

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (local: `3000`) |
| `NODE_ENV` | `development` o `production` |
| `MONGODB_URI` | URI de conexión de MongoDB Atlas |
| `BETTER_AUTH_SECRET` | Secreto de Better Auth. Generar con `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `BETTER_AUTH_URL` | URL **del frontend** (local: `http://localhost:5173`) |
| `GITHUB_CLIENT_ID` | Client ID de la OAuth App de GitHub |
| `GITHUB_CLIENT_SECRET` | Client Secret de la OAuth App de GitHub |

### 3. Frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

El frontend no necesita `.env`: llama siempre a `/api` y el proxy de Vite lo reenvía a `http://localhost:3000`.
Entrar siempre por `http://localhost:5173`.

### 4. Primer admin

Todo usuario nuevo tiene rol `user`. Para el primer admin: registrarse y en **Atlas → Browse Collections →
`user`** cambiar el campo `role` a `"admin"`. Cerrar sesión y volver a entrar. A partir de ahí los roles se
pueden cambiar desde **Admin → Usuarios**.

---

## GitHub OAuth

Se usan **dos OAuth Apps** (GitHub acepta una sola callback por app), en
GitHub → Settings → Developer settings → OAuth Apps:

| Campo | Local | Producción |
|---|---|---|
| Homepage URL | `http://localhost:5173` | `https://cineteca-front.onrender.com` |
| Authorization callback URL | `http://localhost:5173/api/auth/callback/github` | `https://cineteca-front.onrender.com/api/auth/callback/github` |

## Deploy en Render

**MongoDB Atlas:** Network Access → permitir `0.0.0.0/0` (las IPs de Render cambian).

**Backend — Web Service**

| Campo | Valor |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install --include=dev && npm run build` |
| Start Command | `npm start` |
| Variables | `NODE_ENV=production`, `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=https://cineteca-front.onrender.com`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (los de la OAuth App de producción) |

**Frontend — Static Site**

| Campo | Valor |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Variable | `NODE_VERSION=22` |

Redirects/Rewrites (en este orden):

| Source | Destination | Action |
|---|---|---|
| `/api/*` | `https://cineteca-back.onrender.com/api/*` | Rewrite |
| `/*` | `/index.html` | Rewrite |

- La primera regla hace que el front llame a la API por `/api` (mismo origen, la cookie de sesión funciona sin CORS).
- La segunda hace que F5 funcione en cualquier ruta del frontend (React Router).

## Seguridad

- Ningún secreto está commiteado: `.env` está en `.gitignore` y solo se sube `backend/.env.example` sin valores.
- Las contraseñas las hashea Better Auth; las sesiones viven en Mongo y se pueden revocar.
- La búsqueda escapa los caracteres especiales antes de usarlos en una regex.
