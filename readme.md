
# Saituri 9000

Expense tracking for individuals.

## How to run

### Requirements

- Node.js (version specified in `.nvmrc`)
  - Use [`fnm`](https://github.com/Schniz/fnm) for Node.js version management. It will automatically use the
    correct version of Node.js when you `cd` into the project directory.
- [Yarn](https://yarnpkg.com/getting-started/install)
- Docker and Docker Compose (for local Postgres database)
  - Or compatible alternative (e.g. Podman)

### Steps

1. Install dependencies: `yarn`
2. Start local PostgreSQL `yarn infra:up`
3. Run migrations: `yarn db:migrate`
4. Previous step should automatically generate the database client, but if it didn't, generate it manually with `yarn db:generate-client`
4. Start the backend server: `yarn backend:start`
5. Start the frontend dev server: `yarn frontend:start`
6. Open http://localhost:1234 in your browser
