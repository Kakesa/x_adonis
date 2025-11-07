# ----------------------------------------
# Base image
# ----------------------------------------
FROM node:22.16.0-alpine3.22 AS base
WORKDIR /app

# ----------------------------------------
# Dépendances
# ----------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Production dependencies
FROM base AS production-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN node ace build

# ----------------------------------------
# Production image
# ----------------------------------------
FROM node:22.16.0-alpine3.22 AS prod
WORKDIR /app

# ----------------------------------------
# Variables d'environnement (à passer au build/run)
# ----------------------------------------
ARG TZ
ARG PORT
ARG HOST
ARG LOG_LEVEL
ARG APP_KEY
ARG NODE_ENV
ARG SESSION_DRIVER
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG DB_DATABASE
ARG APP_URL

ENV NODE_ENV=${NODE_ENV:-production}
ENV TZ=${TZ:-Africa/Kinshasa}
ENV PORT=${PORT:-8080}
ENV HOST=${HOST:-0.0.0.0}
ENV LOG_LEVEL=${LOG_LEVEL:-info}
ENV APP_KEY=${APP_KEY}
ENV SESSION_DRIVER=${SESSION_DRIVER:-cookie}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_DATABASE=${DB_DATABASE}
ENV APP_URL=${APP_URL}

# ----------------------------------------
# Copier node_modules production
# ----------------------------------------
COPY --from=production-deps /app/node_modules /app/node_modules
# Copier le build
COPY --from=build /app/build /app

# ----------------------------------------
# Script de démarrage
# ----------------------------------------
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE ${PORT}

CMD ["./start.sh"]
