# syntax=docker/dockerfile:1

FROM node:20-slim AS base
RUN corepack enable

# ---- Dependencies ----
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Build ----
# Only NEXT_PUBLIC_* values are needed here — Next.js inlines them into the
# client bundle at build time. They're public by design (shipped to the
# browser), unlike DATABASE_URL / SUPABASE_SERVICE_ROLE_KEY, which stay out of
# the image entirely and are injected at container runtime instead.
FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- Runtime ----
# Not using Next's `output: standalone` here: its dependency tracer doesn't
# reliably pick up playwright-core's non-JS data files (e.g. browsers.json)
# under pnpm's symlinked node_modules, which broke Chromium at runtime. Full
# node_modules + `next start` costs more image size but is what actually works.
FROM mcr.microsoft.com/playwright:v1.61.1-noble AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

USER pwuser
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
