FROM node:18-alpine AS builder
WORKDIR /app

# Copy static assets
COPY public public

# Install dependencies
COPY .yarn .yarn
COPY .yarnrc.yml yarn.lock package.json ./
RUN yarn install --immutable

# Copy DB schema and generate client
COPY db db
RUN yarn db:generate-client

# Copy source code and build
COPY tsconfig.json .
COPY src src
RUN yarn build

FROM node:18-alpine AS app

# Install curl
RUN apk add --no-cache curl

WORKDIR /app

COPY .yarn .yarn
COPY .yarnrc.yml yarn.lock package.json ./
# install only prod deps
RUN YARN_CACHE_FOLDER=/root/.yarn yarn workspaces focus --production --all \
  && rm -rf /root/.yarn /root/.cache/prisma

COPY --from=builder /app/build/ ./build/
COPY --from=builder /app/db/ ./db/
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/public/ ./public/
COPY --from=builder /app/package.json ./package.json

HEALTHCHECK --interval=10s --timeout=3s CMD curl --fail http://127.0.0.1:$PORT/api/health || exit 1

CMD ["sh", "-c", "yarn db:prod:migrate && yarn backend:prod:start"]
