# Shoppershala — CRUD Express Fullstack Monorepo

## Project Overview

Fullstack e-commerce platform built as a **pnpm workspace monorepo**:

- **`apps/backend/`** — Layered Express.js v5 REST API with MongoDB (native driver v7), JWT auth, Zod validation, Winston logging
- **`apps/frontend/`** — Vite + React 19 SPA with Tailwind v4, TanStack Form, Zustand state, Radix UI primitives

---

## Quick Start

```bash
pnpm install            # Install all dependencies
# Ensure MongoDB is running (see docker-compose.yml)
pnpm seed               # Seed DB with mock users/categories/products/orders/reviews/wishlists
pnpm dev                # Launch both servers concurrently (backend:3000, frontend:5173)
pnpm build              # Build frontend for production
```

---

## Architecture

### Backend (apps/backend/)

**Layered MVC:** `Request → Routes → Middleware → Controller → Service → Model → MongoDB`

```
apps/backend/src/
├── config/db.js          # MongoDB connection manager (connectDb/closeDbConnection)
├── controllers/          # Request handlers, JSON response formatting
├── middlewares/          # JWT auth, Zod validation, request ID, async error wrapper
├── models/               # Raw MongoDB queries (CRUD + aggregation pipelines)
├── routes/               # Express.Router() mappings under /api/v1
├── services/             # Business logic layer (orchestrates models)
├── utils/                # Logger, JWT utils, bcrypt passwords, Zod schemas
├── app.js                # Express app setup (middleware stack, route registration)
└── server.js             # Bootstrap (connect DB → listen) + graceful shutdown
```

**Key patterns:**

- **Subpath imports** (`#utils/*`, `#models/*`, `#services/*`, etc.) — defined in `apps/backend/package.json` imports field
- **ES Modules only** — `"type": "module"` in package.json
- **All endpoints under `/api/v1/`**
- **Async error handling** — controllers wrapped in `asyncHandler` middleware; uncaught exceptions caught by process handlers in server.js
- **Validation** — Zod schemas in `validation.schema.js`, applied via `validate` middleware
- **Logging** — Winston with daily-rotate-file, 5 transports (app, error, http, exceptions, rejections)

### Frontend (apps/frontend/)

```
apps/frontend/src/
├── components/           # Reusable UI (layout/, ui/ with Radix primitives)
├── hooks/useApi.js       # Custom React hooks for data fetching
├── pages/                # Route-level page components
├── stores/               # Zustand stores (auth, cart, wishlist, UI)
├── utils/api.js          # Axios instance with auth interceptor
├── App.jsx               # HashRouter + route definitions + context providers
├── index.css             # Tailwind v4 + design tokens
└── main.jsx              # Entry point
```

**Key patterns:**

- **HashRouter** — zero-config client-side routing
- **Zustand** — state management (auth, cart, wishlist, UI themes)
- **TanStack React Form** — form handling with validation
- **TanStack React Query** — server state caching
- **Tailwind v4** — utility-first CSS with `@tailwindcss/vite` plugin
- **Axios interceptor** — injects JWT from localStorage; unwraps response data

---

## Available Commands

Run from root:

| Command             | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `pnpm dev`          | Start both frontend and backend in parallel (nodemon + vite) |
| `pnpm build`        | Build all packages (frontend production build)               |
| `pnpm seed`         | Seed MongoDB with mock data                                  |
| `pnpm start`        | Run backend production server                                |
| `pnpm lint`         | Lint all apps (ESLint flat config)                           |
| `pnpm lint:fix`     | Auto-fix lint issues                                         |
| `pnpm format`       | Format all files with Prettier                               |
| `pnpm format:check` | Check formatting without writing                             |
| `pnpm test`         | Run all tests across workspace                               |

---

## API Endpoints

Prefix: `/api/v1`

| Module     | Endpoints                                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Auth       | `POST /auth/register`, `POST /auth/login`, `GET /auth/whoami`                                                                            |
| Users      | `POST /users/create`, `GET /users/`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`                                           |
| Categories | `POST /categories/`, `GET /categories/`, `GET /categories/:id`, `PATCH /categories/:id`, `DELETE /categories/:id`                        |
| Products   | `POST /products/`, `GET /products/`, `GET /products/:id`, `PATCH /products/:id`, `DELETE /products/:id`                                  |
| Orders     | `POST /orders/`, `GET /orders/`, `GET /orders/my`, `GET /orders/:id`, `PATCH /orders/:id`, `DELETE /orders/:id`                          |
| Reviews    | `POST /reviews/`, `GET /reviews/`, `GET /reviews/my`, `GET /reviews/product/:productId`, `PATCH /reviews/:id`, `DELETE /reviews/:id`     |
| Wishlist   | `GET /wishlist/`, `POST /wishlist/add`, `DELETE /wishlist/remove/:productId`, `DELETE /wishlist/clear`, `GET /wishlist/check/:productId` |
| Analytics  | `GET /analytics/dashboard`, `/sales`, `/top-products`, `/category-sales`, `/user-stats`, `/order-status`, `/monthly-trend`               |

**Seed credentials:** `admin`/`admin123`, `seller`/`seller123`, `buyer`/`buyer123`

---

## Database

- **MongoDB** via native driver v7 (no Mongoose)
- 6 collections: `users`, `categories`, `products`, `orders`, `reviews`, `wishlists`
- Connection managed in `apps/backend/src/config/db.js`
- `connectDb(uri)` returns a connected `MongoClient` instance
- Export client once, reuse across models
- Models import client from `#config/db.js` and use `client.db(DB_NAME).collection(...)`

---

## Code Conventions

- **ESM** — all `.js` files are ES modules; no `require()`, no `__dirname`
- **Subpath imports** — use `#utils/`, `#models/`, `#services/`, `#controllers/`, `#routes/`, `#middlewares/`, `#config/` — never `../../` relative paths
- **Naming**: `kebab-case` for files, `camelCase` for variables/functions, `PascalCase` for classes/React components
- **Error responses**: `{ error: string, details?: Array }`
- **Success responses**: `{ message: string, status: "ok", data: {...}, pagination?: { page, limit, total, totalPages } }`
- **JWT** in `Authorization: Bearer <token>` header, 24h expiry
- **Validation** — all POST/PATCH bodies validated via Zod schemas before reaching controller
- **No TypeScript** — pure JavaScript

---

## Testing

- **Vitest** for backend tests (config: `apps/backend/vitest.config.js`)
- Run: `pnpm --filter ./apps/backend test`
- Test files co-located: `*.test.js` next to source files or in `__tests__/`

---

## Environment Variables

Backend (`apps/backend/.env`):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=crud-express
JWT_SECRET=your_secret_key
NODE_ENV=development
LOG_RETENTION_DAYS=30
LOG_MAX_SIZE=20m
SERVICE_NAME=crud-express
```

Frontend uses `http://localhost:3000/api/v1` hardcoded in `api.js`.

---

## Docker

```bash
docker compose up -d     # Start MongoDB
docker compose down      # Stop MongoDB
```

The `docker-compose.yml` at root provides a MongoDB 7 container for local development.

---

## Git Convention

- **Commit messages**: conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`)
- **Hooks**: Husky runs lint-staged on `pre-commit`, commitlint on `commit-msg`
- **Branch names**: `feature/`, `fix/`, `chore/`, `refactor/` prefixes

---

## AI Guidelines

1. **Read CLAUDE.md first** — this file contains all context needed
2. **Subpath imports** — always use `#utils/`, `#models/` etc. in backend code, never relative paths
3. **Layered architecture** — keep MVC separation: routes → controllers → services → models
4. **No TypeScript** — write plain JS
5. **ESM syntax** — `import`/`export`, never `require`
6. **Before creating files** — check if the file already exists; prefer editing
7. **Tests** — co-locate with source files, run before/after changes
8. **Validation** — add Zod schemas for new POST/PATCH endpoints
9. **Error handling** — throw from services, catch in controllers via asyncHandler
10. **Logging** — use the Winston logger (`#utils/logger.js`) not console.log
