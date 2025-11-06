FROM node:22.16.0-alpine3.22 AS base

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build

# Production stage
FROM base
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
ENV NODE_ENV=${NODE_ENV}
ENV SESSION_DRIVER=${SESSION_DRIVER}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_DATABASE=${DB_DATABASE}

WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app

RUN node ace migration:run --force

EXPOSE 8080
CMD ["node", "./bin/server.js"]
