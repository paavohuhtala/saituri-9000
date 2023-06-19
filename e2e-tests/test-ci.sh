#!/bin/sh

# Start Docker
yarn db:test:start

# Run Parcel
yarn frontend:build-test

# Run Playwright
yarn playwright test

# Shutdown Docker
yarn db:test:stop
