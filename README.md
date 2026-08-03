# Nexo Projects API

[![CI](https://github.com/samuelgvera16-cpu/nexo-projects-api/actions/workflows/ci.yml/badge.svg)](https://github.com/samuelgvera16-cpu/nexo-projects-api/actions/workflows/ci.yml)

REST API for a collaborative project and task management platform.

Nexo Projects is being developed as a portfolio project to demonstrate backend development with TypeScript, Express, PostgreSQL, runtime validation, automated testing, and continuous integration.

> **Project status:** Backend foundation in active development. Task CRUD is implemented. Authentication, project endpoints, authorization, and the frontend are planned.

## Current Features

- Task creation, retrieval, update, and deletion.
- PostgreSQL persistence and relational constraints.
- Request validation with Zod.
- UUID route-parameter validation.
- Parameterized SQL queries.
- Centralized application error handling.
- PostgreSQL constraint error mapping.
- Environment-variable validation.
- Graceful server and database shutdown.
- Reproducible database schema.
- Safe demonstration data.
- Automated API validation tests.
- Automated CI checks with GitHub Actions.

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- node-postgres
- Zod
- Vitest
- Supertest
- GitHub Actions

## Architecture

Requests move through separate application layers:

```text
HTTP request
    |
    v
Routes
    |
    v
Validation middleware
    |
    v
Controllers
    |
    v
Services
    |
    v
PostgreSQL
```

Responsibilities:

- **Routes** define HTTP methods and paths.
- **Middleware** validates input and handles errors.
- **Controllers** translate HTTP requests into service calls.
- **Services** contain database operations.
- **PostgreSQL** enforces relational integrity and constraints.

## Project Structure

```text
nexo-projects-api/
├── .github/
│   └── workflows/
│       └── ci.yml
├── database/
│   ├── schema.sql
│   └── seed.sql
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/
│   │   └── task.controller.ts
│   ├── errors/
│   │   └── AppError.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   ├── models/
│   │   └── task.ts
│   ├── routes/
│   │   └── task.routes.ts
│   ├── schemas/
│   │   └── task.schema.ts
│   ├── services/
│   │   └── task.service.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   └── app.test.ts
├── .env.example
├── LICENSE
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Requirements

Install these tools before running the project:

- Node.js 24 or later
- npm
- PostgreSQL
- Git

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/samuelgvera16-cpu/nexo-projects-api.git
cd nexo-projects-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS or Linux:

```bash
cp .env.example .env
```

Update `.env` with your local PostgreSQL credentials:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=nexo_projects
```

Never commit `.env` or real credentials.

### 4. Create the database

Using PostgreSQL:

```sql
CREATE DATABASE nexo_projects;
```

### 5. Create the schema

Using `psql`:

```bash
psql -U postgres -d nexo_projects -f database/schema.sql
```

You can also open `database/schema.sql` in pgAdmin Query Tool and execute it against the `nexo_projects` database.

The schema creates:

- `users`
- `projects`
- `project_members`
- `tasks`
- `comments`

### 6. Load demonstration data

Using `psql`:

```bash
psql -U postgres -d nexo_projects -f database/seed.sql
```

The seed contains local demonstration records only. Authentication is not implemented yet, so its password hashes are deliberately unusable placeholders.

### 7. Start development mode

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts the TypeScript development server in watch mode.

```bash
npm run typecheck
```

Checks TypeScript without generating files.

```bash
npm run build
```

Compiles `src` into `dist`.

```bash
npm start
```

Runs the compiled application from `dist`.

```bash
npm test
```

Runs the automated test suite once.

```bash
npm run test:watch
```

Runs tests in watch mode.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Returns API information |
| `GET` | `/tasks` | Returns all tasks |
| `GET` | `/tasks/:id` | Returns one task |
| `POST` | `/tasks` | Creates a task |
| `PUT` | `/tasks/:id` | Updates selected task fields |
| `DELETE` | `/tasks/:id` | Deletes a task |

## Request Examples

The seed file creates known UUID values that can be used locally.

### Get all tasks

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/tasks"
```

### Get one demonstration task

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/tasks/30000000-0000-4000-8000-000000000001"
```

### Create a task

```powershell
$taskBody = @{
  project_id = "20000000-0000-4000-8000-000000000001"
  created_by = "10000000-0000-4000-8000-000000000001"
  assigned_to = "10000000-0000-4000-8000-000000000002"
  title = "Review the API documentation"
  description = "Confirm that setup instructions work from a clean environment."
  priority = "high"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/tasks" `
  -ContentType "application/json" `
  -Body $taskBody
```

### Update a task

```powershell
$updateBody = @{
  status = "completed"
  priority = "urgent"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Put `
  -Uri "http://localhost:3000/tasks/30000000-0000-4000-8000-000000000001" `
  -ContentType "application/json" `
  -Body $updateBody
```

Nullable fields can be cleared explicitly:

```powershell
$clearDescription = @{
  description = $null
} | ConvertTo-Json
```

### Delete a task

```powershell
Invoke-RestMethod `
  -Method Delete `
  -Uri "http://localhost:3000/tasks/TASK_UUID"
```

A successful deletion returns `204 No Content`.

## Validation and Error Responses

Invalid request data returns `400 Bad Request`:

```json
{
  "message": "Datos inválidos",
  "errors": []
}
```

Unknown resources return `404 Not Found`:

```json
{
  "message": "Tarea no encontrada"
}
```

Duplicate resources return `409 Conflict` when a database uniqueness constraint is violated.

Unexpected internal errors return a generic response without exposing PostgreSQL details:

```json
{
  "message": "Error interno del servidor"
}
```

## Testing

The current test suite verifies:

- Root endpoint response.
- Unknown-route handling.
- Invalid UUID rejection.
- Empty-update rejection.
- Malformed JSON handling.

Run it with:

```bash
npm test
```

Database integration tests will be added in a later phase.

## Continuous Integration

GitHub Actions runs the following checks on every push and pull request:

```text
npm ci
npm run typecheck
npm test
npm run build
```

The CI badge at the top of this README shows the current workflow status.

## Security Notes

Implemented:

- Parameterized SQL queries.
- Runtime request validation.
- Environment-variable validation.
- Generic internal error responses.
- Ignored local `.env` files.

Required before production deployment:

- Password hashing.
- Authentication with secure cookies.
- Project membership authorization.
- Role-based permissions.
- Rate limiting.
- CORS restrictions.
- Security headers.
- Request-size limits.
- Production secret management.
- HTTPS.

## Roadmap

### Backend foundation

- [x] Express and TypeScript setup
- [x] PostgreSQL connection
- [x] Relational database schema
- [x] Demonstration seed data
- [x] Task CRUD
- [x] Zod validation
- [x] Centralized error handling
- [x] Automated validation tests
- [x] GitHub Actions CI

### Core domain

- [ ] User endpoints
- [ ] Project endpoints
- [ ] Project membership endpoints
- [ ] Comment endpoints
- [ ] Task pagination, filtering, sorting, and search
- [ ] Database integration tests

### Authentication and authorization

- [ ] User registration
- [ ] Sign in and sign out
- [ ] Password hashing
- [ ] Secure authentication cookies
- [ ] Owner, admin, and member permissions

### Full-stack application

- [ ] React frontend
- [ ] Authentication pages
- [ ] Project dashboard
- [ ] Task forms and filters
- [ ] Kanban board
- [ ] Comments interface
- [ ] Responsive design

### Production readiness

- [ ] OpenAPI documentation
- [ ] Docker development environment
- [ ] Rate limiting and security headers
- [ ] Application logging
- [ ] Cloud deployment

## License

This project is available under the [MIT License](LICENSE).