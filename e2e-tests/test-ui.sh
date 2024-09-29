#!/bin/sh

set -e

# Ensure Chromium is installed
yarn playwright install chromium

# Start Docker
yarn db:test:start

tmux \
    new-session 'yarn frontend:test:watch' \; \
    setw -g mouse on \; \
    split-window 'yarn playwright test --ui'

finish() {
    # Shutdown Docker
    yarn db:test:stop
}

trap finish EXIT
