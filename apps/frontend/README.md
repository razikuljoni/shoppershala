# Shoppershala Frontend

A premium e-commerce SPA built with **React 19**, **Vite 8**, and **Tailwind CSS v4**. Features a luxury dark-themed UI with role-based dashboards, real-time wallet management, wishlist, product catalog with search and filtering, and an integrated AI Copilot assistant.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Data Flow](#architecture--data-flow)
- [Pages & Routes](#pages--routes)
- [State Management](#state-management)
- [UI Component Library](#ui-component-library)
- [Design System](#design-system)
- [Key Dependencies](#key-dependencies)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment & API](#environment--api)
- [Role-Based Access](#role-based-access)

---

## Tech Stack

| Layer             | Technology                                     |
| ----------------- | ---------------------------------------------- |
| **Framework**     | React 19                                       |
| **Bundler**       | Vite 8                                         |
| **Styling**       | Tailwind CSS v4 + `tailwindcss-animate`        |
| **Routing**       | React Router v7 (HashRouter)                   |
| **HTTP Client**   | Axios (with JWT interceptor)                   |
| **Server State**  | TanStack React Query v5                        |
| **Client State**  | Zustand v5                                     |
| **Forms**         | TanStack React Form v1                         |
| **UI Primitives** | Radix UI (13+ components)                      |
| **Animation**     | Framer Motion v12                              |
| **Icons**         | Lucide React                                   |
| **Notifications** | Sonner                                         |
| **Utilities**     | clsx, tailwind-merge, class-variance-authority |

---

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.jsx        # Main app wrapper (navbar + sidebar + content)
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   └── Sidebar.jsx         # Collapsible sidebar menu
│   │   ├── ui/
│   │   │   ├── avatar.jsx          # Radix Avatar primitive
│   │   │   ├── badge.jsx           # Status/category badge
│   │   │   ├── button.jsx          # Button variants (primary, ghost, outline, etc.)
│   │   │   ├── card.jsx            # Card container
│   │   │   ├── input.jsx           # Styled input field
│   │   │   ├── label.jsx           # Radix Label primitive
│   │   │   ├── progress.jsx        # Radix Progress bar
│   │   │   ├── scroll-area.jsx     # Radix ScrollArea
│   │   │   ├── separator.jsx       # Radix Separator
│   │   │   ├── skeleton.jsx        # Loading skeleton placeholder
│   │   │   └── tabs.jsx            # Radix Tabs primitive
│   │   └── AiCopilot.jsx           # Floating AI chat assistant
│   ├── hooks/
│   │   └── useApi.js               # Custom React Query hooks for all API endpoints
│   ├── lib/
│   │   └── utils.js                # cn() utility (clsx + tailwind-merge)
│   ├── pages/
│   │   ├── Auth.jsx                # Login & Registration (TanStack Form)
│   │   ├── Cart.jsx                # Shopping cart management
│   │   ├── Catalog.jsx             # Product catalog with search & filters
│   │   ├── Checkout.jsx            # Order placement & wallet payment
│   │   ├── Dashboard.jsx           # Seller/Admin analytics & management
│   │   ├── ProductDetails.jsx      # Single product view with reviews
│   │   └── Profile.jsx             # User profile, order history & reviews
│   ├── stores/
│   │   ├── authStore.js            # Zustand auth state
│   │   ├── cartStore.js            # Zustand cart state
│   │   ├── uiStore.js              # Zustand UI preferences (sidebar, theme)
│   │   └── wishlistStore.js        # Zustand wishlist state
│   ├── utils/
│   │   └── api.js                  # Axios instance + all API endpoint functions
│   ├── App.jsx                     # HashRouter, route guards, global state providers
│   ├── index.css                   # Tailwind v4 + design tokens (536 lines)
│   └── main.jsx                    # Entry point (QueryClientProvider + React StrictMode)
├── index.html                      # HTML shell
├── vite.config.js                  # Vite configuration (React, Tailwind, @ alias)
└── package.json
```

---

## Architecture & Data Flow

```
Browser → HashRouter → Route → Page Component
                                  ↓
                    ┌─────────────────────────────┐
                    │  TanStack React Query (API)  │
                    │  Zustand Stores (Client)     │
                    └─────────────────────────────┘
                                  ↓
                          utils/api.js (Axios)
                                  ↓
                    JWT Bearer Token Interceptor
                                  ↓
                      Backend API (/api/v1/*)
```

### Key Design Decisions

- **HashRouter** — Used instead of BrowserRouter for zero-configuration routing. No server-side redirect setup needed. All routes are hash-based (`#/path`).
- **Dual State Layer** — Server state (products, orders, reviews) cached via TanStack React Query; client-only state (UI toggles, auth session) lives in Zustand.
- **Axios Interceptors** — Request interceptor injects JWT from `localStorage`; response interceptor unwraps `response.data` and maps `meta` → `pagination` for consistent pagination handling.
- **Colocated Hooks** — All API interaction is abstracted into `useApi.js`, providing React Query mutations and queries with automatic toast notifications and cache invalidation.

---

## Pages & Routes

| Route          | Page             | Auth Required | Role Required | Description                                       |
| -------------- | ---------------- | ------------- | ------------- | ------------------------------------------------- |
| `/auth`        | `Auth`           | No            | —             | Login / Registration with TanStack Form           |
| `/`            | `Catalog`        | Yes           | —             | Product grid, search, category filter, pagination |
| `/wishlist`    | `Catalog`        | Yes           | —             | Wishlist-only filtered product grid               |
| `/product/:id` | `ProductDetails` | Yes           | —             | Product info, reviews, rating, add-to-cart        |
| `/cart`        | `Cart`           | Yes           | —             | Cart items, quantity adjustment, total summary    |
| `/checkout`    | `Checkout`       | Yes           | —             | Address form, wallet balance, place order         |
| `/profile`     | `Profile`        | Yes           | —             | Orders history, reviews, wallet top-up            |
| `/dashboard`   | `Dashboard`      | Yes           | Seller/Admin  | Analytics, product/category/user management       |

### Route Guards

- **`RequireAuth`** — Redirects unauthenticated users to `/auth`
- **`RequireSeller`** — Restricts access to users with `seller` or `admin` roles
- **Auth page redirect** — Authenticated users visiting `/auth` are redirected to `/`

---

## State Management

### Server State (TanStack React Query)

All data-fetching hooks are defined in `useApi.js`:

| Hook                      | Query Key                               | Cache Invalidation Partners        |
| ------------------------- | --------------------------------------- | ---------------------------------- |
| `useProducts()`           | `['products', {page,limit,categoryId}]` | Mutations for create/update/delete |
| `useProduct(id)`          | `['product', id]`                       | Review submission, product update  |
| `useCategories()`         | `['categories']`                        | Create/delete category mutations   |
| `useMyOrders()`           | `['my-orders', {page,limit}]`           | Order creation mutation            |
| `useProductReviews(id)`   | `['reviews', productId]`                | Review creation mutation           |
| `useMyReviews()`          | `['my-reviews']`                        | Review creation/deletion           |
| `useWishlist()`           | `['wishlist']`                          | Add/remove wishlist mutations      |
| `useAnalyticsDashboard()` | `['analytics-dashboard']`               | Product/order mutations            |

### Client State (Zustand)

| Store           | State                            | Actions                              |
| --------------- | -------------------------------- | ------------------------------------ |
| `authStore`     | `currentUser`, `token`           | `login`, `logout`, `updateUser`      |
| `cartStore`     | `items` (product → quantity map) | `addItem`, `removeItem`, `updateQty` |
| `wishlistStore` | `productIds[]`                   | `add`, `remove`, `toggle`            |
| `uiStore`       | `sidebarOpen`, `theme`           | `toggleSidebar`, `setTheme`          |

---

## UI Component Library

All UI components are built with **Radix UI primitives** and styled with **class-variance-authority (CVA)** for variant management:

| Component    | Radix Primitive               | Variants / Features                                          |
| ------------ | ----------------------------- | ------------------------------------------------------------ |
| `Button`     | — (native `button`)           | `default`, `destructive`, `outline`, `ghost`, `link` + sizes |
| `Card`       | — (native `div`)              | Interactive hover state, glass-effect variant                |
| `Input`      | — (native `input`)            | Error state styling                                          |
| `Badge`      | — (native `span`)             | `default`, `success`, `warning`, `destructive`               |
| `Tabs`       | `@radix-ui/react-tabs`        | Animated indicator                                           |
| `Avatar`     | `@radix-ui/react-avatar`      | Fallback initials, image loading                             |
| `Progress`   | `@radix-ui/react-progress`    | Animated bar                                                 |
| `ScrollArea` | `@radix-ui/react-scroll-area` | Custom scrollbar                                             |
| `Separator`  | `@radix-ui/react-separator`   | Horizontal/vertical variants                                 |

Additional primitives installed but not yet used in current components:
`@radix-ui/react-checkbox`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-popover`, `@radix-ui/react-select`, `@radix-ui/react-slot`, `@radix-ui/react-tooltip`

---

## Design System

The design system is defined entirely in `index.css` using **Tailwind CSS v4's `@theme` directive**:

### Theme: Obsidian Dark

```css
@theme {
  --color-background: #04060a;
  --color-foreground: #f8fafc;
  --color-primary: hsl(243 75% 59%); /* Indigo */
  --color-primary-glow: rgba(99, 102, 241, 0.2);
  --color-card: rgba(12, 17, 29, 0.65);
  /* ... 40+ design tokens */
}
```

### Key Styling Features

- **Dark-first** — Deep navy/obsidian palette with indigo accent
- **Glass morphism** — Cards and modals use `backdrop-filter: blur()` with semi-transparent backgrounds
- **Gradient text** — Brand headings use `gradient-text` utility class
- **Glow effects** — Primary elements have subtle indigo glow via `box-shadow`
- **Bounce animations** — Loading states use Framer Motion page transitions and CSS loading dots
- **Custom fonts** — Outfit (display) + Plus Jakarta Sans (body) via Google Fonts
- **Responsive** — Mobile sidebar, fluid grid layouts

### Page Transitions

All route changes use Framer Motion's `AnimatePresence` with:

- **Enter**: `opacity: 0 → 1`, `y: 10 → 0` over 250ms (ease-out)
- **Exit**: `opacity: 1 → 0`, `y: 0 → -6` over 150ms

---

## Key Dependencies

| Package                    | Purpose                                |
| -------------------------- | -------------------------------------- |
| `@tanstack/react-query`    | Server state caching & synchronization |
| `@tanstack/react-form`     | Form state management & validation     |
| `zustand`                  | Lightweight client-side state          |
| `axios`                    | HTTP client with interceptor support   |
| `react-router-dom`         | Hash-based client routing              |
| `framer-motion`            | Page transitions, micro-animations     |
| `tailwindcss` v4           | Utility-first CSS framework            |
| `@tailwindcss/vite`        | Tailwind v4 Vite plugin                |
| `@radix-ui/*`              | Accessible, unstyled UI primitives     |
| `lucide-react`             | Consistent icon set                    |
| `sonner`                   | Toast notifications                    |
| `clsx` / `tailwind-merge`  | Conditional className merging          |
| `class-variance-authority` | Component variant management           |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Backend API running on `http://localhost:3000` (see [Backend README](../backend/README.md))

### Installation

```bash
# From the monorepo root
pnpm install

# Start the frontend dev server (from root or this directory)
pnpm dev
```

The app starts on `http://localhost:5173` and proxies API calls to `http://localhost:3000/api/v1`.

### Build for Production

```bash
pnpm build
# Output: apps/frontend/dist/
```

---

## Available Scripts

```bash
pnpm dev          # Start Vite dev server with HMR
pnpm build        # Production build to dist/
pnpm preview      # Preview production build locally
pnpm lint         # ESLint check
pnpm lint:fix     # Auto-fix ESLint issues
```

---

## Environment & API

The API base URL is hardcoded in `src/utils/api.js`:

```javascript
const BASE_URL = 'http://localhost:3000/api/v1';
```

All authenticated requests automatically include the JWT token from `localStorage` via Axios request interceptor.

### Response Format

The Axios response interceptor unwraps all responses:

```javascript
// Raw API response:
{ "message": "...", "status": "ok", "data": {...}, "meta": { "page": 1, "limit": 10, "total": 42 } }

// After interceptor:
{ "message": "...", "status": "ok", "data": {...}, "pagination": { "page": 1, "limit": 10, "total": 42 } }
```

Errors are normalized: `error.response.data.error || error.response.data.message || error.message`

### Pagination

All list endpoints accept `page` and `limit` query parameters. The pagination metadata is available on every list response.

---

## Role-Based Access

| Role   | Capabilities                                                        |
| ------ | ------------------------------------------------------------------- |
| Buyer  | Browse products, add to cart, place orders, leave reviews, wishlist |
| Seller | All buyer capabilities + Dashboard: manage products, view analytics |
| Admin  | All capabilities + User management, role assignment                 |

Seed accounts (created via `pnpm seed`):

| Username | Password    | Role   |
| -------- | ----------- | ------ |
| `admin`  | `admin123`  | admin  |
| `seller` | `seller123` | seller |
| `buyer`  | `buyer123`  | buyer  |

---

## Related

- [Backend API README](../backend/README.md) — Express.js REST API documentation
- [Root README](../../README.md) — Monorepo overview & setup
