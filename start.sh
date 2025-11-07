#!/bin/sh
set -e

# Charger les variables locales si elles existent (pour dev/local)
if [ -f .env ]; then
  echo "🔧 Loading local .env variables..."
  export $(grep -v '^#' .env | xargs)
fi

echo "⏳ Waiting for database at $DB_HOST:$DB_PORT ..."

# Attendre que la DB soit prête
until nc -z $DB_HOST $DB_PORT; do
  sleep 2
done

echo "✅ Database is ready."

# Rollback si demandé
if [ "$RUN_ROLLBACK" = "true" ]; then
  echo "⚠️ Rolling back last migration batch..."
  node ace migration:rollback --force || echo "No rollback needed."
fi

echo "🚀 Running migrations..."
node ace migration:run --force

# Lancer le serveur AdonisJS
echo "✅ Starting AdonisJS server..."
node ./bin/server.js
