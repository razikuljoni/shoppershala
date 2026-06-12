# AGENTS.md — Shoppershala Fullstack Monorepo

Welcome to the fullstack monorepo layout for **Shoppershala**. This document lists workspace conventions, scripts, architecture layers, and developer guidelines to ensure the project is fully "AI-ready" and easy to run/modify.

---

## Workspace Project Structure

The project is structured as a **pnpm workspace monorepo**:

```
crud-express/
├── apps/
│   ├── backend/               # Layered Express.js API
│   │   ├── src/
│   │   │   ├── config/        # MongoDB client connections
│   │   │   ├── controllers/   # Request handlers
│   │   │   ├── middlewares/   # JWT, validation, errors
│   │   │   ├── models/        # Native MongoDB queries
│   │   │   ├── routes/        # Express router mappings
│   │   │   ├── scripts/       # Seed script (seed.js)
│   │   │   ├── services/      # Business logic
│   │   │   └── utils/         # Winston logger, passwords, schemas
│   │   ├── package.json
│   │   └── nodemon.json
│   └── frontend/              # Vite + React + Tailwind CSS Client
│       ├── src/
│       │   ├── components/    # Reusable UI elements (Radix, Charts, Sidebar)
│       │   ├── hooks/         # Custom React hooks
│       │   ├── pages/         # Storefront & Admin/Seller views
│       │   ├── stores/        # Zustand state management
│       │   ├── utils/         # API interaction wrappers (api.js)
│       │   ├── App.jsx        # Routing, contexts, states
│       │   ├── index.css      # Tailwind v4 + design system
│       │   └── main.jsx       # Bootstrapper
│       └── package.json
├── skills/                    # Project-specific AI skills
│   ├── api-security-best-practices/
│   ├── express-rest-api/
│   ├── mongodb/
│   ├── nodejs-backend-patterns/
│   └── nodejs-express-server/
├── .github/workflows/         # CI/CD pipelines
├── .opencode/                 # OpenCode AI configuration
├── .vscode/                   # Shared editor settings
├── package.json               # Workspace orchestra script config
├── pnpm-workspace.yaml        # Workspace projects definition
├── CLAUDE.md                  # AI assistant instructions (primary)
└── AGENTS.md                  # Developer guidelines (this file)
```

---

## Workspace Scripts & Commands

Run all scripts from the **root directory** of the repository:

```bash
pnpm install                  # Install all dependencies and link workspaces
pnpm seed                     # Seed MongoDB database with rich mock data
pnpm dev                      # Launch both frontend & backend dev servers concurrently
pnpm build                    # Build frontend and compile workspace production packs
pnpm start                    # Run the backend production server
pnpm lint                     # Lint all apps with ESLint
pnpm lint:fix                 # Auto-fix ESLint issues across all apps
pnpm format                   # Format all files with Prettier
pnpm format:check             # Check formatting without writing
pnpm test                     # Run all tests across workspace
```

---

## Architecture & Layers

### Backend Layered MVC Flow

```
Request → Routes → Middleware → Controller → Service → Model → MongoDB
```

- **Subpath Imports**: Backend uses Node.js subpath imports defined in `apps/backend/package.json` for clean internal imports:
  - `#utils/*` maps to `./src/utils/*`
  - `#config/*` maps to `./src/config/*`
  - `#routes/*` maps to `./src/routes/*`
  - `#models/*` maps to `./src/models/*`
  - `#services/*` maps to `./src/services/*`
  - `#controllers/*` maps to `./src/controllers/*`
  - `#middlewares/*` maps to `./src/middlewares/*`
- **API Version**: All endpoints are routed under `/api/v1/`.
- **CORS**: Configured in `app.js` using `cors()` allowing origins (defaults to frontend client running on `http://localhost:5173`).
- **Graceful Shutdown**: SIGINT/SIGTERM handlers close HTTP server and MongoDB connection.

### Frontend Client Architecture

```
Vite Client → React Router (HashRouter) → API Layer (api.js) → TanStack Query → Zustand Stores → View Render
```

- **Routing Model**: Uses `HashRouter` for zero-configuration client-side routing.
- **State Management**: Zustand stores for client state, TanStack React Query for server state caching.
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite` plugin, Radix UI primitives, Framer Motion animations.
- **API Module**: Axios-based `api.js` with JWT interceptor, automatic pagination mapping.

---

## Database Schema & Models

Seeding provides predefined items across multiple collections:

1. **`users`**: User records with hashed credentials and roles:
   - `admin` (username: `admin` | password: `admin123`)
   - `seller` (username: `seller` | password: `seller123`)
   - `buyer` (username: `buyer` | password: `buyer123`)
2. **`categories`**: Groupings for products (Electronics, Fashion, Books, etc.).
3. **`products`**: Shop items storing price, stock counts, category reference, description, and mock image arrays.
4. **`orders`**: Checkout records containing transaction metrics, item counts, prices, shipping address, and order state.
5. **`reviews`**: Product ratings (1-5 stars) and comments.
6. **`wishlists`**: Set mappings for products wishlisted by buyers.

---

## Code Conventions

- **Language**: JavaScript (ES Modules) — no TypeScript
- **Imports**: Subpath imports (`#utils/`) in backend, relative imports in frontend
- **Async**: `async/await` throughout; no raw callbacks or `.then()`
- **Error handling**: Services throw, controllers catch and format via `asyncHandler`
- **Naming**: `kebab-case` files, `camelCase` variables/functions, `PascalCase` components
- **Validation**: Zod schemas for all POST/PATCH endpoints
- **Logging**: Winston logger (`#utils/logger.js`) — never `console.log`
- **Git**: Conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`)

---

## Error Response Format

```json
{
  "error": "Validation failed",
  "details": [{ "field": "password", "message": "Password must be at least 6 characters" }]
}
```

---

## AI Agent Integration

This workspace is designed to be fully readable by AI coding assistants:

- Subpath imports eliminate complex relative path strings (e.g. `../../../../utils/` is replaced by `#utils/`).
- Standardized API calls are wrapped into `api.js` so endpoints and parameter structures are immediately obvious.
- The seed script (`apps/backend/src/scripts/seed.js`) provides a clear blueprint of the MongoDB schema and co-relational structures.
- Per-app ESLint flat configs ensure consistent code quality.
- Project-level skills in `skills/` provide domain guidance for backend development patterns.
- `CLAUDE.md` at root provides comprehensive AI context (always read it first).

---

## Testing

- **Vitest** for backend unit/integration tests
- Tests live next to source files (`*.test.js`)
- Run: `pnpm test` (root) or `pnpm --filter ./apps/backend test`
- MongoDB should be running for integration tests

---

## Docker Development

```bash
docker compose up -d    # Start MongoDB 7
docker compose down     # Stop and clean up
```

---

## Troubleshooting

| Issue                      | Likely Cause                  | Fix                               |
| -------------------------- | ----------------------------- | --------------------------------- |
| Backend won't start        | MongoDB not running           | `docker compose up -d`            |
| Port 3000 in use           | Another process               | `lsof -ti :3000 \| xargs kill -9` |
| Port 5173 in use           | Another vite dev server       | `lsof -ti :5173 \| xargs kill -9` |
| ESLint errors after format | Prettier indentation conflict | `pnpm lint:fix && pnpm format`    |
| Module not found errors    | Dependencies not installed    | `pnpm install`                    |
