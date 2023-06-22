
# Saituri 9000

Expense tracking for small groups AKA self-hosted WeShare replacement.

## Requirements

- Node.js (version specified in `.nvmrc`)
  - Use [`fnm`](https://github.com/Schniz/fnm) for Node.js version management. It will automatically use the
    correct version of Node.js when you `cd` into the project directory.
- [Yarn](https://yarnpkg.com/getting-started/install)
- Docker and Docker Compose 2+ (for local Postgres database)
  - Compatible alternative (e.g. Podman) might work
- tmux is required for running integration tests in UI mode

## First run

1. Copy `.env.sample` to `.env` and fill in the values. The defaults should work for local development.
2. Install dependencies: `yarn`
3. Start local PostgreSQL: `yarn infra:dev:up`
4. Run migrations: `yarn db:dev:migrate`
5. Previous step should automatically generate the database client, but if it didn't, generate it manually with `yarn db:generate-client`.

Remember to run migrations and / or generate the database client when the database schema changes.

## Development

1. Start local PostgreSQL: `yarn infra:dev:up`
2. Start the backend server: `yarn backend:dev:start`
3. Start the frontend dev server: `yarn frontend:dev:start`
4. Open http://localhost:1234 in your browser

Backend is automatically restarted on changes. Frontend will hot reload on changes.

### Testing

Saituri supports integration / browser tests using Playwright. Tests require Docker Compose, because they run against a real PostgreSQL instance. Test scripts build, start and stop the necessary infrastructure automatically.

There are two different ways to run the tests:
- `yarn test:e2e:ci`
  - This runs the tests once and prints the results to the terminal. There is some overhead in starting and stopping the infrastructure, so this is better suited for CI than for local development.
- `yarn test:e2e:ui`
  - This command starts the necessary infrastructure and then Playwright in [UI mode](https://playwright.dev/docs/test-ui-mode). The UI makes it easy to create and debug tests, and it supports running tests in watch mode. Backend, frontend and test code is automatically reloaded on changes, though tests are only re-run on changes to test code. The UI starts as a separate Chromium instance.

Tests are run in GitHub Actions as a part of the CI pipeline. Error traces are uploaded as artifacts, and after downloading they can be viewed using `yarn playwright show-trace [filename]`.

## Production

- Saituri doesn't support HTTPS by itself, so it's highly recommended to run it behind a reverse proxy that handles HTTPS, like Nginx.
- Make sure to create a separate `.env` file for production use, and set `HOST` and `PORT` to the correct values.
- Run `yarn infra:prod:up` (or `docker compose -f saituri-compose.yaml up` if you don't have Yarn installed on the server)
  - Pass `--build` to rebuild the images.
- The server should now be running on http://localhost:3001 (or whatever you set `PORT` to in `.env`).

You can use `/api/health` for health checks.

