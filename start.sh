#!/bin/sh
set -e

echo "⏳ Waiting for database at $DB_HOST:$DB_PORT ..."

# Attendre que la DB soit prête
until nc -z $DB_HOST $DB_PORT; do
  sleep 2
done

echo "✅ Database is ready."

# Si tu veux rollback avant de relancer (⚠️ attention ça supprime des données)
if [ "$RUN_ROLLBACK" = "true" ]; then
  echo "⚠️ Rolling back last migration batch..."
  node ace migration:rollback --force || echo "No rollback needed."
fi

echo "🚀 Running migrations..."
node ace migration:run --force

echo "✅ Starting AdonisJS server..."
node ./bin/server.js
