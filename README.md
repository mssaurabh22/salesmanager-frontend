# SalesManager React App

This React app is wired to the existing Spring Boot CRM backend in this repository.

## Features

- JWT login using `/api/auth/login`
- Role-aware dashboards for `ADMIN` and `EMPLOYEE`
- Lead creation, search, and stage updates
- Activity creation and lead activity lookup
- Follow-up creation, completion, and missed-follow-up view
- Lead timeline lookup
- Admin-only lead reassignment
- Admin-only analytics reports
- Automatic access-token refresh using `/api/auth/refresh`

## Backend assumptions

- Spring Boot app runs on `http://localhost:8081`
- API responses use the shared envelope:

```json
{
  "status": "success",
  "message": null,
  "data": {}
}
```

- JWT contains `userId`, `role`, and `sub` claims

## Run locally

1. Start the backend app.
2. From this folder, install dependencies:

```powershell
$env:COREPACK_HOME='D:\salesManager\salesmanager\.corepack'
corepack pnpm install
```

3. Start the Vite dev server:

```powershell
$env:COREPACK_HOME='D:\salesManager\salesmanager\.corepack'
node_modules\.bin\vite.cmd
```

Vite proxies `/api` to `http://localhost:8081` so local development avoids CORS issues.

4. For a production build:

```powershell
node_modules\.bin\tsc.cmd -b
node_modules\.bin\vite.cmd build
```

## Run with Docker

From the repository root:

```powershell
docker compose up --build
```

If your machine uses the standalone Compose binary instead of the newer plugin command, use:

```powershell
docker-compose up --build
```

This starts:

- frontend at [http://localhost:3000](http://localhost:3000)
- backend at [http://localhost:8081](http://localhost:8081)

The backend still uses your local PostgreSQL instance and does not start a database container.

## Seed credentials

- Admin: `admin@crm.com` / `admin123`
- Employee: `employee@crm.com` / `employee123`
