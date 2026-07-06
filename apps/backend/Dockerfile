# ============================================
# Shoppershala Backend — Production Dockerfile
# ============================================
# Multi-stage build optimized for pnpm monorepo
# Uses Node 24 alpine for minimal image size

# ---- Stage 1: Dependencies ----
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

FROM base AS deps
WORKDIR /app

# Copy workspace root files first (layer caching)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy only backend package.json for dependency resolution
COPY apps/backend/package.json apps/backend/

# Install all workspace dependencies (including dev for potential build steps)
RUN pnpm install --frozen-lockfile

# ---- Stage 2: Production ----
FROM base AS production
WORKDIR /app

# Copy workspace root files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy backend package.json
COPY apps/backend/package.json apps/backend/

# Copy only production dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules

# Copy backend source code
COPY apps/backend/ apps/backend/

# Set working directory to backend
WORKDIR /app/apps/backend

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose backend port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/v1/health || exit 1

# Run the server
CMD ["node", "src/server.js"]
