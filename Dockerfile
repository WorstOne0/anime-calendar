# ---- deps ----------------------------------------------------------------
FROM node:24-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- build ---------------------------------------------------------------
FROM node:24-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Includes .env: NEXT_PUBLIC_ANILIST_CLIENT_ID is baked in here, so changing it needs a rebuild.
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- runtime -------------------------------------------------------------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
# standalone already contains the pruned node_modules and a server.js entry. Owned by node so ISR can write its cache.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 5003
ENV PORT=5003
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
