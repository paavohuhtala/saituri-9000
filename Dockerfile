FROM node:18-alpine
WORKDIR /app

# Copy static assets
COPY public public

# Install dependencies
COPY .yarnrc.yml yarn.lock package.json .
COPY .yarn .yarn
RUN yarn

# Copy DB schema and generate client
COPY db db
RUN yarn db:generate-client

# Copy source code and build
COPY tsconfig.json .
COPY src src
RUN yarn build

# Remove dev dependencies
RUN yarn workspaces focus --production --all
