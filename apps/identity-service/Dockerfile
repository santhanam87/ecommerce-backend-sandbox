# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

# Enable corepack and activate the exact pnpm version used in the monorepo
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

WORKDIR /workspace

# Copy root workspace descriptor files first (for layer caching)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy only the service package.json so pnpm can resolve the workspace graph
COPY ./apps/identity-service/package.json ./apps/identity-service/package.json

# Install all dependencies (dev included - needed to run nest build)
RUN pnpm install --frozen-lockfile

# Copy the rest of the service source
COPY ./apps/identity-service/ ./apps/identity-service/

# Compile TypeScript
RUN pnpm --filter identity-service build

# Produce a self-contained deployment folder with production deps only
# --legacy is required by pnpm v10+ for non-injected workspace deploys
RUN pnpm --filter identity-service deploy --prod --legacy /app/deploy

# pnpm deploy does not copy dist (it is output of build, excluded from context), so copy it manually
RUN cp -r ./apps/identity-service/dist /app/deploy/dist

# ---- Stage 2: Production ----
FROM node:22-alpine AS production

WORKDIR /app

# Copy the fully self-contained bundle from the builder
COPY --from=builder /app/deploy ./

ENV NODE_ENV=production

EXPOSE 3004

CMD ["node", "dist/main"]
