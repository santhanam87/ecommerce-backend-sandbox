# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

# Enable corepack and activate the exact pnpm version used in the monorepo
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

WORKDIR /workspace

# Copy root workspace descriptor files first (for layer caching)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy only the service package.json so pnpm can resolve the workspace graph
COPY ./apps/product-information-service/package.json ./apps/product-information-service/package.json

# Install all dependencies (dev included - needed to run nest build)
RUN pnpm install --frozen-lockfile

# Copy the rest of the service source
COPY ./apps/product-information-service/ ./apps/product-information-service/

# Compile TypeScript
RUN pnpm --filter product-information-service build

# Produce a self-contained deployment folder with production deps only
# --legacy is required by pnpm v10+ for non-injected workspace deploys
RUN pnpm --filter product-information-service deploy --prod --legacy /app/deploy

# pnpm deploy does not copy dist (it is output of build, excluded from context), so copy it manually
RUN cp -r ./apps/product-information-service/dist /app/deploy/dist

# ---- Stage 2: Production ----
FROM node:22-alpine AS production

WORKDIR /app

# Copy the fully self-contained bundle from the builder
COPY --from=builder /app/deploy ./

ENV NODE_ENV=production

EXPOSE 3003

CMD ["node", "dist/main"]