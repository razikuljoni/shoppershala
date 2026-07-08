# Shadcn UI Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate shadcn UI v4 into the Shoppershala frontend with a custom Deep Teal + Amber (OKLch) theme, replacing the current indigo/obsidian CSS tokens while keeping all existing code functional.

**Architecture:** shadcn generates editable `.tsx` component files and injects OKLch CSS variables into `index.css` via Tailwind v4 `@theme inline`. The existing CVA components (`.jsx`) remain untouched alongside new shadcn components. Dark/light mode uses a `.dark` class strategy on `<html>`.

**Tech Stack:** Tailwind CSS v4, shadcn UI v4, React 19, Vite 8, TypeScript, OKLch

---

### Task 1: TypeScript Configuration

**Files:**

- Create: `apps/frontend/tsconfig.json`

- [ ] **Step 1: Create tsconfig.json for the frontend**

TypeScript packages (`typescript`, `@types/react`, `@types/react-dom`) are already in `devDependencies`. Write the config:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

The `@/*` path alias matches the existing Vite config (`vite.config.js:14`).

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd apps/frontend && npx tsc --noEmit`
Expected: exits 0 (no TS files to check yet — okay to see "No inputs were found in config file")

---

### Task 2: shadcn Init

**Files:**

- Create: `apps/frontend/components.json` (by shadcn CLI)
- Create: `apps/frontend/src/lib/utils.ts` (by shadcn CLI)
- Modify: `apps/frontend/src/index.css` (by shadcn CLI — injects `@theme inline`)

- [ ] **Step 1: Run shadcn init**

```bash
cd apps/frontend
npx shadcn@latest init --ts
```

The CLI will prompt interactively. Use these answers:

- **Default style**: `nova` (modern shadcn v4)
- **Base color**: `slate` (will be overwritten in Task 3)
- **CSS variables**: Yes
- **Dark mode**: `class` strategy (`.dark` class on `<html>`)

Expected outcome:

- `components.json` created with `@/` path alias (auto-detected from Vite config)
- `src/lib/utils.ts` created with `cn()` function (uses `clsx` + `tailwind-merge`)
- `index.css` updated: a `@theme inline {}` block injected with default shadcn color tokens and a `.dark` variant block

- [ ] **Step 2: Verify the files were created**

Run: `ls -la apps/frontend/src/lib/utils.ts apps/frontend/components.json`
Expected: both files exist

- [ ] **Step 3: Review the injected CSS structure**

```bash
cd apps/frontend
head -30 src/index.css
```

Expected to see `@theme inline { --background: ... ; }` and `.dark { ... }` variant blocks injected at the top.

---

### Task 3: Theme CSS — Inject Deep Teal + Amber Tokens

**Files:**

- Modify: `apps/frontend/src/index.css`

- [ ] **Step 1: Replace the `@theme inline` color tokens with our Deep Teal + Amber palette**

The shadcn init injected a `@theme inline {}` block at the top of `index.css`. Replace it entirely with our custom tokens. The file already has an existing `@theme {}` block (lines 10-79) with the old indigo/obsidian theme that houses keyframes and utility tokens. We only replace the `@theme inline` block that shadcn created.

Content to write for the `@theme inline` section:

```css
@theme inline {
  --color-background: oklch(0.12 0.02 200);
  --color-foreground: oklch(0.93 0.012 80);
  --color-card: oklch(0.16 0.02 200);
  --color-card-foreground: oklch(0.93 0.012 80);
  --color-popover: oklch(0.16 0.02 200);
  --color-popover-foreground: oklch(0.93 0.012 80);
  --color-primary: oklch(0.55 0.12 200);
  --color-primary-foreground: oklch(0.99 0 0);
  --color-secondary: oklch(0.3 0.05 200);
  --color-secondary-foreground: oklch(0.93 0.012 80);
  --color-muted: oklch(0.2 0.02 200);
  --color-muted-foreground: oklch(0.55 0.03 200);
  --color-accent: oklch(0.3 0.05 200);
  --color-accent-foreground: oklch(0.8 0.08 80);
  --color-destructive: oklch(0.55 0.2 25);
  --color-destructive-foreground: oklch(0.99 0 0);
  --color-border: oklch(1 0 0 / 8%);
  --color-input: oklch(1 0 0 / 10%);
  --color-ring: oklch(0.55 0.12 200);
  --radius: 0.75rem;
}
```

- [ ] **Step 2: Add the light theme `.dark` variant**

shadcn uses the `:root` for light mode and `.dark` class for dark mode. Since we want dark as default, we put the dark tokens in `:root` and add a light variant. But wait — the shadcn pattern in v4 with class-based dark mode puts the dark tokens inside `.dark { }` and the light/default tokens in `:root`. Since our project is dark-first:

Approach: Put our Deep Teal dark tokens in `:root` (default), then add a separate `:root.light` or use the existing `.dark` class toggle. Actually, the simplest approach is:

- `:root` = dark theme (our Deep Teal + Amber dark)
- `.dark` class block = empty (since dark is already default — just toggle class off for light)
- OR: Use a light class on `<html>` for light mode

Simplest: Keep `:root` as the dark tokens, and add a `.light` / `:root:not(.dark)` for light tokens. Let me follow the standard shadcn approach:

In shadcn v4 with `class` strategy:

- `:root` = light mode CSS variables
- `.dark` = dark mode CSS variables
- The `<html>` element gets a `.dark` class to toggle to dark mode.

BUT our project currently has dark mode as the default. We have two options:

1. Put dark in `:root` and light in `.light` class — but this deviates from standard shadcn
2. Follow standard shadcn (light in `:root`, dark in `.dark`) and default to adding `.dark` class on `<html>`

Option 2 is better for long-term maintainability. We'll set `class="dark"` on `<html>` by default.

Add the light theme tokens to `:root` and dark theme to `.dark`:

```css
:root {
  --color-background: oklch(0.97 0.01 85);
  --color-foreground: oklch(0.15 0.02 200);
  --color-card: oklch(0.99 0.005 85);
  --color-card-foreground: oklch(0.15 0.02 200);
  --color-popover: oklch(0.99 0.005 85);
  --color-popover-foreground: oklch(0.15 0.02 200);
  --color-primary: oklch(0.48 0.12 200);
  --color-primary-foreground: oklch(0.99 0 0);
  --color-secondary: oklch(0.9 0.02 200);
  --color-secondary-foreground: oklch(0.25 0.04 200);
  --color-muted: oklch(0.93 0.008 85);
  --color-muted-foreground: oklch(0.5 0.03 200);
  --color-accent: oklch(0.9 0.02 200);
  --color-accent-foreground: oklch(0.25 0.04 200);
  --color-destructive: oklch(0.55 0.2 25);
  --color-destructive-foreground: oklch(0.99 0 0);
  --color-border: oklch(0.85 0.01 85);
  --color-input: oklch(0.85 0.01 85);
  --color-ring: oklch(0.48 0.12 200);
  --radius: 0.75rem;
}

.dark {
  --color-background: oklch(0.12 0.02 200);
  --color-foreground: oklch(0.93 0.012 80);
  --color-card: oklch(0.16 0.02 200);
  --color-card-foreground: oklch(0.93 0.012 80);
  --color-popover: oklch(0.16 0.02 200);
  --color-popover-foreground: oklch(0.93 0.012 80);
  --color-primary: oklch(0.55 0.12 200);
  --color-primary-foreground: oklch(0.99 0 0);
  --color-secondary: oklch(0.3 0.05 200);
  --color-secondary-foreground: oklch(0.93 0.012 80);
  --color-muted: oklch(0.2 0.02 200);
  --color-muted-foreground: oklch(0.55 0.03 200);
  --color-accent: oklch(0.3 0.05 200);
  --color-accent-foreground: oklch(0.8 0.08 80);
  --color-destructive: oklch(0.55 0.2 25);
  --color-destructive-foreground: oklch(0.99 0 0);
  --color-border: oklch(1 0 0 / 8%);
  --color-input: oklch(1 0 0 / 10%);
  --color-ring: oklch(0.55 0.12 200);
}
```

- [ ] **Step 3: Update the existing `@theme {}` block**

The old `@theme {}` block (lines 10-79) contains non-color tokens we want to keep: fonts, shadows, animations, layout, etc. Update the color references in it to point to our new `@theme inline` variables and remove the old color values. Keep everything else.

Specifically:

- Remove duplicate color definitions from `@theme {}` (they now live in `@theme inline`)
- Keep: `--font-*`, `--radius-*`, `--shadow-*`, `--sidebar-width`, `--navbar-height`, `--animate-*`
- Add custom amber accent tokens as `@theme {}` variables:

  ```css
  --color-amber: oklch(0.72 0.12 75);
  --color-amber-foreground: oklch(0.15 0.02 75);
  --color-amber-muted: oklch(0.3 0.05 75);
  ```

- [ ] **Step 4: Add `.dark` class to `<html>` in main.jsx**

The shadcn class strategy requires `<html>` to have `class="dark"` for dark mode. The project is dark-first, so default to dark.

In `apps/frontend/src/main.jsx`, add the class toggle before the `createRoot` call (after the `QueryClient` setup, before line 22). Edit to insert:

```javascript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { toast } from 'sonner';
import './index.css';
import App from './App.jsx';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error?.message || 'Failed to load data');
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Default to dark mode (shadcn class strategy)
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
```

This inserts one line (`document.documentElement.classList.add('dark')`) before `createRoot`.

- [ ] **Step 5: Verify no CSS conflicts**

Run: `cd apps/frontend && npx tsc --noEmit`
Expected: exits 0 (no type errors)

---

### Task 4: Generate Core shadcn Components

**Files:**

- Create: `apps/frontend/src/components/ui/button.tsx` (by shadcn CLI)
- Create: `apps/frontend/src/components/ui/card.tsx` (by shadcn CLI)
- Create: `apps/frontend/src/components/ui/input.tsx` (by shadcn CLI)
- Create: `apps/frontend/src/components/ui/label.tsx` (by shadcn CLI)
- Create: `apps/frontend/src/components/ui/badge.tsx` (by shadcn CLI)

- [ ] **Step 1: Add Button component**

```bash
cd apps/frontend
npx shadcn@latest add button
```

Expected: `src/components/ui/button.tsx` created with shadcn's default Button component using `cn()` and `cva()`.

- [ ] **Step 2: Add Card component**

```bash
cd apps/frontend
npx shadcn@latest add card
```

Expected: `src/components/ui/card.tsx` created with Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter.

- [ ] **Step 3: Add Input component**

```bash
cd apps/frontend
npx shadcn@latest add input
```

Expected: `src/components/ui/input.tsx` created.

- [ ] **Step 4: Add Label component**

```bash
cd apps/frontend
npx shadcn@latest add label
```

Expected: `src/components/ui/label.tsx` created with `@radix-ui/react-label`.

- [ ] **Step 5: Add Badge component**

```bash
cd apps/frontend
npx shadcn@latest add badge
```

Expected: `src/components/ui/badge.tsx` created with badge variants using `cva()`.

- [ ] **Step 6: Verify all components compile**

```bash
cd apps/frontend
npx tsc --noEmit
```

Expected: exits 0

---

### Task 5: Verify & Cleanup

- [ ] **Step 1: Start dev server and check for errors**

```bash
cd apps/frontend
npx vite --host
```

Wait for the server to start. Navigate to `http://localhost:5173` and check the browser console for errors.

Expected: Page loads, no 500 errors, no console errors.

- [ ] **Step 2: Remove the color preview demo file**

```bash
rm apps/frontend/public/color-preview.html
```

- [ ] **Step 3: Run the linter**

```bash
cd apps/frontend
npx eslint src/ --ext .js,.jsx,.ts,.tsx
```

Expected: No new lint errors (pre-existing errors may appear — note them but don't fix).

- [ ] **Step 4: Final verification**

```bash
cd apps/frontend
npx tsc --noEmit && echo "TypeScript OK"
```

Expected: "TypeScript OK" printed.
