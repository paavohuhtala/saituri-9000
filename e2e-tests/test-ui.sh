#!/bin/sh

set -e

# Start Docker
yarn db:test:start

tmux \
    new-session 'yarn frontend:test:watch' \; \
    split-window 'yarn playwright test --ui'

function finish {
    # Shutdown Docker
    yarn db:test:stop
}

trap finish EXIT
