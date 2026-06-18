# Dockerfile para producción - MEISA Web
FROM node:20-bookworm-slim AS base

# Install dependencies
FROM base AS deps
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Build the application
FROM base AS builder
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Next.js SSG consulta Prisma durante el build (páginas públicas migradas a DB).
# Aceptamos DATABASE_URL como build-arg; fallback a dummy para builds locales
# sin DB. En CI/CD se pasa la URL real via --build-arg.
ARG DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1
# Vars NEXT_PUBLIC_* se "hornean" en build → deben llegar como build-arg.
# Default apagado: el widget del chat no aparece hasta que se pase "true".
ARG NEXT_PUBLIC_CHAT_ENABLED=false
ENV NEXT_PUBLIC_CHAT_ENABLED=$NEXT_PUBLIC_CHAT_ENABLED
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
