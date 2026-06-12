# React + Tailwind Frontend Development

## Tech Stack

- **React 19** with JSX (no TypeScript)
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- **Vite 8** as build tool
- **Zustand** for client state management
- **TanStack React Query** for server state caching
- **TanStack React Form** for form validation
- **Axios** for HTTP (configured in `src/utils/api.js`)
- **Radix UI** primitives for accessible components
- **Framer Motion** for animations

## Architecture

```
Vite → HashRouter → api.js (Axios) → TanStack Query / Zustand → Pages → Components (Radix+Tailwind)
```

## Key Conventions

- **HashRouter**: All routing uses hash-based routing (`#/path`)
- **API calls**: Always use `src/utils/api.js` (it handles JWT injection and response unwrapping)
- **State**: Zustand for UI/app state; TanStack React Query for server data
- **Styling**: Tailwind utility classes only — no separate CSS files per component
- **Imports**: Use `@/` alias for `src/` directory (configured in vite.config.js)
- **Components**: Radix UI unstyled primitives + Tailwind classes for styling
- **No TypeScript**: All files are `.jsx` or `.js`

## Available Pages

- `/auth` — Login/Register
- `/catalog` — Product listing with filters
- `/product/:id` — Product details
- `/cart` — Shopping cart
- `/checkout` — Order checkout
- `/dashboard` — Admin/seller dashboard
- `/profile` — User profile

## Component Structure

```
src/
├── components/
│   ├── layout/      # AppShell, Navbar, Sidebar
│   └── ui/          # Radix-based: button, card, input, avatar, badge, etc.
├── pages/           # Route-level page components
├── stores/          # Zustand: auth, cart, wishlist, ui
├── hooks/           # Custom React hooks
├── lib/             # Utility functions (cn, etc.)
└── utils/api.js     # Axios instance
```

## Common Tasks

- **Add a new page**: Create file in `src/pages/`, add `<Route>` in `App.jsx`
- **Add API endpoint**: Add method to `src/utils/api.js`, then use in component
- **Style element**: Use Tailwind classes: `className="flex items-center gap-2 p-4"`
- **Form**: Use TanStack React Form with Zod validation schema
