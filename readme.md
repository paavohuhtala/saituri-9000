
# Saituri 9000

Expense tracking for individuals.

## Requirements

- Node.js (version specified in `.nvmrc`)
  - Use [`fnm`](https://github.com/Schniz/fnm) for Node.js version management. It will automatically use the
    correct version of Node.js when you `cd` into the project directory.
- [Yarn](https://yarnpkg.com/getting-started/install)
- Docker and Docker Compose (for local Postgres database)
  - Or compatible alternative (e.g. Podman)

## First run

1. Copy `.env.example` to `.env` and fill in the values. The defaults should work for local development.
2. Install dependencies: `yarn`
3. Start local PostgreSQL: `yarn infra:up`
4. Run migrations: `yarn db:migrate`
5. Previous step should automatically generate the database client, but if it didn't, generate it manually with `yarn db:generate-client`.

Remember to run migrations and / or generate the database client when the database schema changes.

## Development

1. Start local PostgreSQL: `yarn infra:up`
2. Start the backend server: `yarn backend:start`
3. Start the frontend dev server: `yarn frontend:start`
4. Open http://localhost:1234 in your browser

Backend is automatically restarted on changes. Frontend will hot reload on changes.

## Production

- Build everything: `yarn build`
- Run the backend server: `yarn backend:start-prod`
- The server should now be running on http://localhost:3001.

You can use `/api/health` for health checks.

