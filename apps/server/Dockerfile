# Base image with Bun
FROM oven/bun:latest AS base
WORKDIR /app

# Build stage
FROM base AS builder
WORKDIR /app

# Copy everything
COPY . .

# Install deps from bun.lock
RUN bun install --frozen-lockfile

# Generate OpenAPI spec
RUN cd apps/server && bun run tsoa && bun run openapi

# Build the project
RUN bun run build --filter=@graph/server...

# Final runtime image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --gid 1001 server
USER server

# Copy swagger UI
COPY --from=builder --chown=server:nodejs /app/apps/server/build/swagger.yaml ./build/swagger.yaml
COPY --from=builder --chown=server:nodejs /app/node_modules/swagger-ui-dist /app/node_modules/swagger-ui-dist
RUN rm /app/node_modules/swagger-ui-dist/index.html

# Copy only what's needed to run the server
COPY --from=builder --chown=server:nodejs /app/apps/server/dist ./apps/server/dist

EXPOSE 80
CMD ["bun", "apps/server/dist/server.js"]