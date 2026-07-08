# Shadcn UI Integration — Design Spec

**Date**: 2026-07-07
**Project**: Shoppershala
**Status**: Approved Design

---

## 1. Overview

Integrate shadcn UI (v4) into the existing Shoppershala e-commerce frontend, replacing the current ad-hoc CVA + Radix UI component layer with a unified design token system built on OKLch CSS variables and Tailwind CSS v4 `@theme inline`. The existing custom components remain untouched; shadcn components are added alongside them for gradual migration.

---

## 2. Design Token System

### 2.1 Color Palette: Deep Teal + Amber

All values expressed in OKLch for perceptual uniformity. Dark theme is the signature; light theme inverts backgrounds while sharing the same hue families.

#### Dark Theme

| Token                                        | OKLch           | Hex                      | Role                          |
| -------------------------------------------- | --------------- | ------------------------ | ----------------------------- |
| `--background`                               | `0.12 0.02 200` | `#0d1217`                | Page canvas                   |
| `--foreground`                               | `0.93 0.012 80` | `#ece6da`                | Body text, headings           |
| `--card` / `--popover`                       | `0.16 0.02 200` | `#162028`                | Cards, dropdowns              |
| `--card-foreground` / `--popover-foreground` | `0.93 0.012 80` | `#ece6da`                | Text on card/popover          |
| `--primary`                                  | `0.55 0.12 200` | `#2d7d8a`                | Buttons, links, active states |
| `--primary-foreground`                       | `0.99 0 0`      | `#ffffff`                | Text on primary               |
| `--secondary`                                | `0.3 0.05 200`  | `#2a3a44`                | Secondary fills               |
| `--secondary-foreground`                     | `0.93 0.012 80` | `#ece6da`                | Text on secondary             |
| `--accent`                                   | `0.3 0.05 200`  | `#2a3a44`                | Hover fills, selected items   |
| `--accent-foreground`                        | `0.8 0.08 80`   | `#d4cfc4`                | Text on accent                |
| `--muted`                                    | `0.20 0.02 200` | `#1a2630`                | Sidebar, secondary surfaces   |
| `--muted-foreground`                         | `0.55 0.03 200` | `#7a8288`                | Secondary text                |
| `--destructive`                              | `0.55 0.20 25`  | `#b44a4a`                | Delete, errors                |
| `--destructive-foreground`                   | `0.99 0 0`      | `#ffffff`                | Text on destructive           |
| `--border`                                   | `1 0 0 / 8%`    | `rgba(255,255,255,0.08)` | Dividers, outlines            |
| `--input`                                    | `1 0 0 / 10%`   | `rgba(255,255,255,0.10)` | Input borders                 |
| `--ring`                                     | `0.55 0.12 200` | `#2d7d8a`                | Focus ring                    |

#### Light Theme

| Token                  | OKLch           | Hex       | Role               |
| ---------------------- | --------------- | --------- | ------------------ |
| `--background`         | `0.97 0.01 85`  | `#f7f4ee` | Page canvas        |
| `--foreground`         | `0.15 0.02 200` | `#1a2a32` | Body text          |
| `--card` / `--popover` | `0.99 0.005 85` | `#fffcf8` | Cards              |
| `--primary`            | `0.48 0.12 200` | `#2a6f7a` | Buttons, links     |
| `--primary-foreground` | `0.99 0 0`      | `#ffffff` | Text on primary    |
| `--accent`             | `0.9 0.02 200`  | `#dee6e8` | Hover fills        |
| `--accent-foreground`  | `0.20 0.04 200` | `#1e3a42` | Text on accent     |
| `--muted`              | `0.93 0.008 85` | `#ece8e0` | Secondary surfaces |
| `--muted-foreground`   | `0.50 0.03 200` | `#6a7a80` | Secondary text     |
| `--border`             | `0.85 0.01 85`  | `#d9d0c5` | Borders            |
| `--ring`               | `0.48 0.12 200` | `#2a6f7a` | Focus ring         |

### 2.2 Amber Accents (Brand Extras)

These are not standard shadcn tokens but used for special marketing/sale elements:

| Token                | OKLch          | Hex       |
| -------------------- | -------------- | --------- |
| `--amber`            | `0.72 0.12 75` | `#c49b5c` |
| `--amber-foreground` | `0.15 0.02 75` | `#252017` |
| `--amber-muted`      | `0.3 0.05 75`  | `#3d3124` |

### 2.3 Design Rationale

- **Background teal-black (200° hue, 0.12 lightness)** — reads as intentional dark green-teal, not default dark mode. More distinctive than pure black or navy.
- **Teal primary (200° hue, moderate 0.12 chroma)** — uncommon in e-commerce, premium without being cold.
- **Amber accent (75° hue)** — muted gold, not yellow. Provides warmth without "cheap gold" feel. Used sparingly for CTAs and badges.
- **Warm foreground tint (80° hue)** — all text and surfaces lean slightly warm, avoiding the sterile coldness of many dark themes.
- **Light mode is warm cream (85° hue)** — continues the warmth, far more inviting than stark white.

---

## 3. Component Architecture

### 3.1 Directory Structure After Integration

```
apps/frontend/src/
├── lib/
│   └── utils.ts                 # NEW - cn() classname merge
├── components/
│   └── ui/
│       ├── button.jsx           # EXISTING CVA (deprecated)
│       ├── button.tsx           # NEW shadcn
│       ├── card.tsx             # NEW shadcn
│       ├── input.tsx            # NEW shadcn
│       ├── label.tsx            # NEW shadcn
│       ├── badge.tsx            # NEW shadcn
│       └── ...                  # Additional as needed
├── hooks/
│   └── use-toast.ts             # NEW shadcn hook (if needed)
├── index.css                    # UPDATED - @theme inline tokens
└── components.json              # NEW shadcn config
```

### 3.2 Migration Strategy

| Phase          | Components                        | Approach                                     |
| -------------- | --------------------------------- | -------------------------------------------- |
| 1 – Core       | Button, Input, Label, Card, Badge | Generate shadcn versions, keep old CVA files |
| 2 – Navigation | Sheet, DropdownMenu, Avatar       | Generate as needed for header/account        |
| 3 – Overlays   | Dialog, AlertDialog, Toast        | Generate as needed                           |
| 4 – Data       | Table, Select, Checkbox, Tabs     | Generate as needed                           |
| 5 – Polish     | Skeleton, Skeleton                | Generate as needed                           |

Old CVA components are not removed — they continue working for existing pages. New pages use shadcn. Migration is gradual.

### 3.3 TypeScript Coexistence

shadcn generates `.tsx`. Existing code is `.jsx`. Vite + React 19 handles both without configuration changes. A minimal `tsconfig.json` is added to `apps/frontend/` only if absent.

---

## 4. Implementation Plan

### Prerequisites

- Docker MongoDB running (`docker compose up -d`)
- Dependencies installed (`pnpm install`)

### Step 1: TypeScript Setup (if needed)

```bash
cd apps/frontend
npm install -D typescript @types/react @types/react-dom
```

### Step 2: shadcn Init

```bash
cd apps/frontend
npx shadcn@latest init --ts
```

- Style: `nova` (modern shadcn v4 with OKLch)
- Base color: Use our Deep Teal + Amber values
- CSS variables: Yes
- Dark mode: Class strategy (`.dark` class on `<html>`)

### Step 3: Inject Theme Tokens

Replace the CSS variables in `index.css` with the OKLch values from Section 2. The shadcn `@theme inline` directive in `index.css` maps CSS variable names to Tailwind utility classes (`bg-primary`, `text-foreground`, etc.).

### Step 4: Generate Components

```bash
cd apps/frontend
npx shadcn@latest add button card input label badge
```

### Step 5: Verify

- Dev server starts without errors
- Existing pages render correctly
- New shadcn components render with correct colors

### Step 6: Cleanup

Remove `color-preview.html` demo file from `public/`.

---

## 5. Non-Goals

- No backend changes
- No existing pages rewritten
- No CVA components removed (yet)
- No Zustand store changes
- No routing changes
- No test additions (existing tests not affected)

---

## 6. Rejected Alternatives

- **Warm Indigo + Slate**: Rejected as too common/expected
- **Deep Plum + Gold**: Stunning but too editorial for general e-commerce
- **Deep Forest + Terracotta**: Beautiful but warm-cool balance less versatile
- **Full CVA replacement at once**: Too disruptive; gradual migration preferred
