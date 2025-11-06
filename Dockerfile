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

# Variables d'environnement
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

ENV NODE_ENV=production
ENV TZ=${TZ}
ENV PORT=${PORT}
ENV HOST=${HOST}
ENV LOG_LEVEL=${LOG_LEVEL}
ENV APP_KEY=${APP_KEY}
ENV SESSION_DRIVER=${SESSION_DRIVER}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_DATABASE=${DB_DATABASE}

# Copier node_modules production
COPY --from=production-deps /app/node_modules /app/node_modules
# Copier le build
COPY --from=build /app/build /app

# Script pour démarrage + migrations
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Exposer le port
EXPOSE 8080

# Lancer le script
CMD ["/app/start.sh"]
