#!/bin/sh

set -e

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
