FROM node:lts-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json .
COPY pnpm-*.yaml .

COPY apps/frontend/package.json ./apps/frontend/
COPY packages/client/package.json ./packages/client/

RUN pnpm install

COPY apps/frontend/ ./apps/frontend/
COPY packages/client/ ./packages/client/

WORKDIR /app/apps/frontend

RUN pnpm run build

FROM nginx:alpine AS runner 

COPY --from=builder /app/apps/frontend/dist/ /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

LABEL org.opencontainers.image.source="https://github.com/triosnok/isi-planning-tool"
LABEL org.opencontainers.image.description="Frontend container image for isi-planning-tool"
