#!/bin/sh

set -e

# Check Docker Compose version (at least 2)
if ! docker-compose version --short | grep -E '^2\.'; then
  echo "Docker Compose version must be at least 2"
  exit 1
fi

# Start Docker
yarn db:test:start

# Run Parcel
yarn frontend:build-test

# Run Playwright
yarn playwright test

# Shutdown Docker
yarn db:test:stop
