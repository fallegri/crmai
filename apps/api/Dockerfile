FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

COPY apps/api ./apps/api
RUN pnpm --filter @crmai/api run build
RUN pnpm --filter @crmai/api exec prisma generate

EXPOSE 3001

CMD ["node", "apps/api/dist/main"]
