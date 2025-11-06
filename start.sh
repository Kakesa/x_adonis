#!/bin/sh
set -e

echo " Waiting for database at $DB_HOST:$DB_PORT ..."

# Attendre que la DB soit prête
until nc -z $DB_HOST $DB_PORT; do
  sleep 2
done

echo " Database is ready. Running migrations..."
node ace migration:run --force

echo " Starting AdonisJS server..."
node ./bin/server.js
