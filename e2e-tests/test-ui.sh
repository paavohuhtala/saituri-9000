#!/bin/sh

set -e

# Check Docker Compose version (at least 2)
if ! docker compose version --short | grep -E '^2\.'; then
  echo "Docker Compose version must be at least 2"
  exit 1
fi

# Start Docker
yarn db:test:start

# Start Parcel in the background
yarn frontend:watch-test &

# Start Playwright test UI
# Playwright also starts the backend
yarn playwright test --ui

# Shutdown Docker
yarn db:test:stop

# Shutdown Parcel
kill "$(jobs -p)"
