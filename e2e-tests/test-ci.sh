#!/bin/sh

set -e

# Start Docker
yarn db:test:start

# Run Parcel
yarn frontend:test:build

# Run Playwright
yarn playwright test

# Shutdown Docker
yarn db:test:stop
