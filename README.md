# Smart Employee — Backend

This repository contains the backend API for the Smart Employee project.

## What this README covers
- How to install and run the project locally
- Version requirements (Node, npm)
- Required environment variables
- How to run with Docker
- Quick API/service overview and example requests

## Requirements
- Node.js (recommended): 12.x - 18.x (project uses older `sequelize@5` and other dependencies compatible with Node 12+). Use Node 14 or 16 for best compatibility.
- npm (recommended): 6.x or newer (comes with Node)
- PostgreSQL 9.6+ (or compatible) for the database

Note: There is no strict `engines` field in `package.json`; these are recommended based on dependency compatibility.

## Install (local)
1. Clone the repository and cd into the backend folder.

2. Copy environment example and fill the values required:

```bash
cp .env.example .env
# then edit .env to add DB credentials, JWT secrets, and mailer credentials
```

3. Install dependencies:

```bash
npm install
```

4. Setup DB and run migrations (requires `sequelize-cli`):

```bash
# If sequelize-cli is installed globally you can run:
# npx sequelize-cli db:migrate
npx sequelize-cli db:migrate
```

5. Start the app:

```bash
# start your app (project entrypoint is index.js)
node index.js
```

The app should listen on the port configured inside the project (check `src/index.js` or `src/app.js` for express setup).

## Environment variables
This project reads environment variables (see `.env.example`). Here are the variables you must provide:

- NODE_ENV - development|production
- TIME_ZONE - e.g. `Asia/Jakarta`

Database:
- DB_HOST
- DB_DATABASE
- DB_USERNAME
- DB_PASSWORD
- DB_PORT

JWT / Auth:
- JWT_SECRET
- JWT_REFRESH
- JWT_EXPIRES_IN (e.g. `1h`, `7d`)
- JWT_REFRESH_EXPIRES_IN

Mailer (for emails):
- MAILER_EMAIL
- MAILER_PASSWORD
- MAILER_HOST
- MAILER_PORT

Other:
- WEBCORP_USER
- WEBCORP_PASS

Keep secrets out of version control. Use a secret manager for production.

## Docker
A `Dockerfile` is present. Typical Docker workflow:

```bash
# build image from project root
docker build -t smart-employee-backend:latest .

# run container (example, adapt env vars / secrets)
docker run -d \
  --name smart-employee-backend \
  -e NODE_ENV=production \
  -e DB_HOST=... -e DB_DATABASE=... -e DB_USERNAME=... -e DB_PASSWORD=... \
  -p 3000:3000 \
  smart-employee-backend:latest
```

Adjust ports according to the app configuration.

## API / Service overview
This is an Express-based API. The source code is under `src/` and routes are registered in `src/app` and `src/index.js`.

Common features:
- Authentication using JWT
- PostgreSQL via `sequelize` (models in `src/models`)
- File upload handling (multer)
- Cron jobs (node-cron)
- Mail sending (nodemailer)

Example: health check or list endpoints (replace with actual routes found in `src/app/api`):

```bash
# Example: check server is alive
curl -i http://localhost:3000/

# Example: authenticate (replace path and payload with project specifics)
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your@example.com","password":"secret"}'
```

Inspect `src/app/api` for documented routes and controllers.

## Helpful notes
- Migrations are in `src/migrations` and were created with `sequelize-cli` v6. Use `npx sequelize-cli` to run them.
- The project uses `sequelize@5` which is older — upgrading Sequelize may require code changes.
- If you need to run tests, there are currently no test scripts in `package.json`.

## Troubleshooting
- If `sharp` fails to install, ensure you have required build tools installed (on macOS install `pkg-config` and `libvips` via Homebrew):

```bash
brew install pkg-config libvips
```

- If migrations fail, check DB connectivity and that the DB user has proper privileges.

## Next steps / Improvements
- Add `engines` block to `package.json` to pin Node version used by the project.
- Add `start` and `dev` scripts to `package.json` (e.g., `"start": "node index.js", "dev": "nodemon index.js"`).
- Add simple API documentation (OpenAPI/Swagger) or a route list in this README.

---

If you'd like, I can:
- Add `start`/`dev` scripts to `package.json` and update README accordingly.
- Generate a basic OpenAPI spec from route files and include it here.

