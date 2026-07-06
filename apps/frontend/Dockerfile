# ============================================
# Shoppershala Frontend — Production Dockerfile
# ============================================
# Multi-stage build: Node build → Nginx serve
# Optimized for pnpm monorepo with layer caching

# ---- Stage 1: Dependencies ----
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

FROM base AS deps
WORKDIR /app

# Copy workspace root files first (layer caching)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy only frontend package.json for dependency resolution
COPY apps/frontend/package.json apps/frontend/

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# ---- Stage 2: Build ----
FROM base AS builder
WORKDIR /app

# Copy workspace root files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy frontend package.json
COPY apps/frontend/package.json apps/frontend/

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules

# Copy frontend source code
COPY apps/frontend/ apps/frontend/

# Build frontend (Vite)
WORKDIR /app/apps/frontend
RUN pnpm run build

# ---- Stage 3: Serve ----
FROM nginx:1.27-alpine AS production

# Copy custom nginx config
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1

# Nginx runs in foreground
CMD ["nginx", "-g", "daemon off;"]
