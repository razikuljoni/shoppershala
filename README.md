# 🛍️ Shoppershala

**Fullstack E-Commerce Platform** — A production-ready monorepo featuring a layered Express.js REST API and a modern React SPA with a luxury dark-themed UI.

> **Backend**: [Express.js REST API →](./apps/backend/README.md)  
> **Frontend**: [React SPA →](./apps/frontend/README.md)

---

## Project Overview

| Layer        | Stack                                                                | Docs                                         |
| ------------ | -------------------------------------------------------------------- | -------------------------------------------- |
| **Backend**  | Express.js v5, MongoDB (native driver v7), JWT, Zod, Winston         | [Backend README](./apps/backend/README.md)   |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, TanStack Query, Zustand, Radix UI | [Frontend README](./apps/frontend/README.md) |

### Features

- 🔐 **JWT Authentication** — Register, login, role-based access (buyer / seller / admin)
- 🛒 **Product Catalog** — Search, filter by category, paginated grid view
- 🛍️ **Shopping Cart** — Add/remove items, quantity control, checkout flow
- 💳 **Wallet System** — Recharge balance, pay at checkout
- ⭐ **Reviews & Ratings** — Product reviews with average rating calculation
- ❤️ **Wishlist** — Save products for later with toggle functionality
- 📊 **Seller Dashboard** — Sales analytics, top products, category breakdown, monthly trends
- 👥 **Admin Panel** — User management, role assignment
- 🤖 **AI Copilot** — In-app AI chat assistant for guidance
- 📝 **Winston Logging** — Colorized console + daily rotate file logs (5 transports)
- 🐳 **Docker** — One-command MongoDB via Docker Compose

---

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start MongoDB (Docker required)
docker compose up -d

# 3. Seed database with mock data
pnpm seed

# 4. Launch both servers
pnpm dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/ (returns `{ "status": "ok" }`)

### Seed Credentials

| Username | Password    | Role   |
| -------- | ----------- | ------ |
| `admin`  | `admin123`  | Admin  |
| `seller` | `seller123` | Seller |
| `buyer`  | `buyer123`  | Buyer  |

---

## Monorepo Structure

```
shoppershala/
├── apps/
│   ├── backend/             # Express.js REST API (documented below)
│   └── frontend/            # Vite + React SPA (documented below)
├── .github/workflows/       # CI pipeline
├── docker-compose.yml       # MongoDB 7 container
├── pnpm-workspace.yaml      # Workspace definition
├── package.json             # Root scripts & shared devDeps
├── CLAUDE.md                # AI assistant context
└── AGENTS.md                # Developer guidelines
```

For detailed breakdowns:

- [📘 Backend Architecture & API Reference](./apps/backend/README.md)
- [🎨 Frontend Architecture & Component Reference](./apps/frontend/README.md)

---

## Available Commands

Run all commands from the repository root:

| Command             | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `pnpm install`      | Install all dependencies (workspace-wide)             |
| `pnpm dev`          | Start both frontend and backend in parallel           |
| `pnpm build`        | Production build (frontend to `dist/`)                |
| `pnpm start`        | Run backend production server                         |
| `pnpm seed`         | Seed MongoDB with mock users, products, orders & more |
| `pnpm test`         | Run all tests across the workspace                    |
| `pnpm lint`         | Lint all apps (ESLint flat config)                    |
| `pnpm lint:fix`     | Auto-fix lint issues                                  |
| `pnpm format`       | Format all files with Prettier                        |
| `pnpm format:check` | Check formatting without writing                      |

---

## API Overview

Base URL: `http://localhost:3000/api/v1`

| Module     | Endpoints                                                                                                                                | Auth  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Auth       | `POST /auth/register`, `POST /auth/login`, `GET /auth/whoami`                                                                            | Mixed |
| Users      | `POST /users/create`, `GET /users/`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`                                           | Yes   |
| Categories | `POST /categories/`, `GET /categories/`, `GET /categories/:id`, `PATCH /categories/:id`, `DELETE /categories/:id`                        | Yes   |
| Products   | `POST /products/`, `GET /products/`, `GET /products/:id`, `PATCH /products/:id`, `DELETE /products/:id`                                  | Yes   |
| Orders     | `POST /orders/`, `GET /orders/`, `GET /orders/my`, `GET /orders/:id`, `PATCH /orders/:id`, `DELETE /orders/:id`                          | Yes   |
| Reviews    | `POST /reviews/`, `GET /reviews/`, `GET /reviews/my`, `GET /reviews/product/:productId`, `PATCH /reviews/:id`, `DELETE /reviews/:id`     | Yes   |
| Wishlist   | `GET /wishlist/`, `POST /wishlist/add`, `DELETE /wishlist/remove/:productId`, `DELETE /wishlist/clear`, `GET /wishlist/check/:productId` | Yes   |
| Analytics  | `GET /analytics/dashboard`, `/sales`, `/top-products`, `/category-sales`, `/user-stats`, `/order-status`, `/monthly-trend`               | Yes   |

> Full API documentation with request/response examples → [Backend README](./apps/backend/README.md)

---

## Environment Variables

### Backend (`apps/backend/.env`)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=crud-express
JWT_SECRET=your_secret_key
NODE_ENV=development
LOG_RETENTION_DAYS=30
LOG_MAX_SIZE=20m
SERVICE_NAME=crud-express
```

Copy from `.env.example`:

```bash
cp apps/backend/.env.example apps/backend/.env
```

### Frontend

The API base URL is hardcoded in `src/utils/api.js`. No `.env` file is required.

---

## Database

- **MongoDB** via native driver v7 (no Mongoose ORM)
- 6 collections: `users`, `categories`, `products`, `orders`, `reviews`, `wishlists`
- Connection managed in `apps/backend/src/config/db.js`
- Seed script populates all collections with realistic mock data

### Docker MongoDB

```bash
docker compose up -d      # Start MongoDB 7 on port 27017
docker compose down       # Stop and clean up
```

---

## Testing

- **Vitest** for backend unit/integration tests
- Config: `apps/backend/vitest.config.js`
- Run: `pnpm test` (root) or `pnpm --filter ./apps/backend test`
- Test files co-located: `*.test.js` next to source files

---

## Code Conventions

| Rule               | Standard                                                             |
| ------------------ | -------------------------------------------------------------------- |
| **Language**       | JavaScript (ES Modules) — no TypeScript                              |
| **Imports**        | Backend uses subpath imports (`#utils/*`, `#models/*`, etc.)         |
| **Naming**         | `kebab-case` files, `camelCase` functions, `PascalCase` components   |
| **Error format**   | `{ error: string, details?: Array }`                                 |
| **Success format** | `{ message: string, status: "ok", data: {...}, pagination?: {...} }` |
| **Git commits**    | Conventional commits (`feat:`, `fix:`, `chore:`, etc.)               |

---

## Docker Setup

```yaml
# docker-compose.yml
services:
  mongodb:
    image: mongo:7
    ports:
      - '27017:27017'
    volumes:
      - mongodb_data:/data/db
```

---

## Troubleshooting

| Issue                      | Likely Cause               | Fix                               |
| -------------------------- | -------------------------- | --------------------------------- |
| Backend won't start        | MongoDB not running        | `docker compose up -d`            |
| Port 3000 in use           | Another process            | `lsof -ti :3000 \| xargs kill -9` |
| Port 5173 in use           | Another Vite instance      | `lsof -ti :5173 \| xargs kill -9` |
| Module not found           | Dependencies not installed | `pnpm install`                    |
| ESLint errors after format | Prettier conflict          | `pnpm lint:fix && pnpm format`    |

---

## App READMEs

- [📘 Backend — Express API](./apps/backend/README.md)
- [🎨 Frontend — React SPA](./apps/frontend/README.md)
