# Nexo Projects API

[![CI](https://github.com/samuelgvera16-cpu/nexo-projects-api/actions/workflows/ci.yml/badge.svg)](https://github.com/samuelgvera16-cpu/nexo-projects-api/actions/workflows/ci.yml)

REST API for a collaborative project and task management platform.

Nexo Projects is being developed as a portfolio project to demonstrate backend development with TypeScript, Express, PostgreSQL, runtime validation, automated testing, and continuous integration.

> **Project status:** Backend API in active development. Authentication, project and task CRUD, project membership management, project-level authorization, and role-based permissions are implemented. Comment endpoints and the React frontend are planned.

## Current Features

- User registration with normalized email addresses.
- Password hashing with Node.js `scrypt`, unique salts, and timing-safe verification.
- Login and logout with opaque session tokens.
- SHA-256 session-token hashes stored in PostgreSQL.
- `HttpOnly`, `SameSite=Lax` authentication cookies.
- Authenticated current-user endpoint.
- Authenticated project creation, listing, retrieval, update, and deletion.
- Transactional owner membership during project creation.
- Project member listing without exposing password hashes.
- Member addition by normalized email address.
- Owner-controlled member role updates.
- Secure member removal with owner and admin permissions.
- Task creation, retrieval, update, and deletion.
- Project membership authorization for every task operation.
- Owner, admin, and member role handling.
- Owner/admin-only task deletion.
- Server-controlled task creator identity.
- Assignee membership validation.
- Strict request validation with Zod.
- HTTP security headers with Helmet.
- Global and authentication-specific IP rate limiting.
- JSON request bodies limited to 100 KB.
- UUID route-parameter validation.
- Parameterized PostgreSQL queries.
- Centralized application and database error handling.
- Environment-variable validation.
- Graceful server and database shutdown.
- Reproducible schema and database migrations.
- Safe local demonstration data.
- Automated tests with Vitest and Supertest.
- Interactive OpenAPI 3.1 documentation with Swagger UI.
- Downloadable OpenAPI JSON specification.
- Multi-stage Docker image and Docker Compose environment for the API and PostgreSQL.
- Formatting, linting, type checking, testing, and builds in GitHub Actions.

## Tech Stack

- Node.js
- TypeScript
- Express
- Helmet
- express-rate-limit
- PostgreSQL
- node-postgres
- Zod
- Vitest
- Supertest
- OpenAPI 3.1 and Swagger UI
- Docker and Docker Compose
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
|-- .github/workflows/       # Continuous integration
|-- database/
|   |-- migrations/          # Incremental database changes
|   |-- schema.sql           # Complete database schema
|   `-- seed.sql             # Local demonstration data
|-- src/
|   |-- config/              # Environment and PostgreSQL configuration
|   |-- controllers/         # HTTP request handlers
|   |-- errors/              # Application error types
|   |-- middleware/          # Authentication, validation, and errors
|   |-- models/              # TypeScript domain models
|   |-- routes/              # Authentication, projects, member, and task routes
|   |-- schemas/             # Zod request schemas
|   |-- security/            # Password hashing and verification
|   |-- services/            # Database and business operations
|   |-- types/               # Express type augmentation
|   |-- app.ts               # Express application
|   `-- server.ts            # HTTP server lifecycle
|-- tests/                   # Automated test suite
|-- .dockerignore            # Docker build exclusions
|-- .env.example             # Environment variable template
|-- compose.yaml             # API and PostgreSQL services
|-- Dockerfile               # Multi-stage production image
|-- LICENSE
|-- package.json
|-- tsconfig.json
`-- vitest.config.ts
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
- `sessions`
- `projects`
- `project_members`
- `tasks`
- `comments`

### 6. Load demonstration data

Using `psql`:

```bash
psql -U postgres -d nexo_projects -f database/seed.sql
```

The seed contains local demonstration records only. Seeded users have deliberately unusable password placeholders and cannot sign in. Create an authenticated local user through `POST /auth/register` when testing authentication.

### 7. Start development mode

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## Docker Setup

Docker Compose can start the API and PostgreSQL together without requiring a local PostgreSQL configuration.

Requirements:

- Docker Desktop
- Docker Engine running

Build and start the services:

```bash
docker compose up -d --build
```

The containers expose:

- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs/`
- PostgreSQL: `localhost:5433`

Inside the Docker network, the API connects to PostgreSQL through `db:5432`. The database schema and demonstration data are loaded automatically the first time the PostgreSQL volume is created.

Check the container status:

```bash
docker compose ps
```

Stop the services while preserving the database volume:

```bash
docker compose down
```

To intentionally remove the containers and all Docker database data:

```bash
docker compose down -v
```

## Interactive API Documentation

With the development server running, open the Swagger UI:

```text
http://localhost:3000/docs/
```

The downloadable OpenAPI 3.1 document is available at:

```text
http://localhost:3000/openapi.json
```

Swagger UI documents the system, authentication, project, membership, and task endpoints. It also provides request schemas, response schemas, status codes, role requirements, and interactive API execution.

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

```bash
npm run format
```

Formats supported files with Prettier.

```bash
npm run format:check
```

Checks formatting without modifying files.

```bash
npm run lint
```

Runs ESLint across the project.

```bash
npm run lint:fix
```

Applies safe automatic ESLint fixes.

## API Endpoints

| Method   | Endpoint                        | Access              | Description                                     |
| -------- | ------------------------------- | ------------------- | ----------------------------------------------- |
| `GET`    | `/`                             | Public              | Returns API information                         |
| `GET`    | `/docs/`                        | Public              | Serves the interactive Swagger UI               |
| `GET`    | `/openapi.json`                 | Public              | Returns the OpenAPI 3.1 document                |
| `POST`   | `/auth/register`                | Public              | Creates a user                                  |
| `POST`   | `/auth/login`                   | Public              | Creates a database-backed session               |
| `POST`   | `/auth/logout`                  | Public/idempotent   | Deletes the current session and cookie          |
| `GET`    | `/auth/me`                      | Authenticated       | Returns the authenticated user                  |
| `GET`    | `/projects`                     | Authenticated       | Lists projects accessible to the current user   |
| `GET`    | `/projects/:id`                 | Project member      | Returns one accessible project and its role     |
| `POST`   | `/projects`                     | Authenticated       | Creates a project and its owner membership      |
| `PUT`    | `/projects/:id`                 | Project owner/admin | Updates an accessible project                   |
| `DELETE` | `/projects/:id`                 | Project owner       | Deletes a project and associated records        |
| `GET`    | `/projects/:id/members`         | Project member      | Lists project members and their roles           |
| `POST`   | `/projects/:id/members`         | Project owner/admin | Adds a registered user by email                 |
| `PATCH`  | `/projects/:id/members/:userId` | Project owner       | Changes a member between admin and member roles |
| `DELETE` | `/projects/:id/members/:userId` | Project owner/admin | Removes a member according to role permissions  |
| `GET`    | `/tasks`                        | Project member      | Returns tasks from accessible projects          |
| `GET`    | `/tasks/:id`                    | Project member      | Returns one accessible task                     |
| `POST`   | `/tasks`                        | Project member      | Creates a task in an accessible project         |
| `PUT`    | `/tasks/:id`                    | Project member      | Updates an accessible task                      |
| `DELETE` | `/tasks/:id`                    | Project owner/admin | Deletes a task with role-based permission       |

Task endpoints use project membership authorization. Unauthorized project resources are returned as `404 Not Found` to avoid disclosing private resource identifiers.

## Request Examples

The examples below use Windows PowerShell and preserve the authentication cookie in a web session.

### Register a local user

```powershell
$registerBody = @{
  name = "Local Developer"
  email = "developer@example.com"
  password = "Local demo password 2026!"
} | ConvertTo-Json

Invoke-WebRequest `
  -UseBasicParsing `
  -Method Post `
  -Uri "http://localhost:3000/auth/register" `
  -ContentType "application/json" `
  -Body $registerBody
```

### Sign in and preserve the session cookie

```powershell
$loginBody = @{
  email = "developer@example.com"
  password = "Local demo password 2026!"
} | ConvertTo-Json

Invoke-WebRequest `
  -UseBasicParsing `
  -Method Post `
  -Uri "http://localhost:3000/auth/login" `
  -ContentType "application/json" `
  -Body $loginBody `
  -SessionVariable nexoSession
```

The API stores only a SHA-256 hash of the opaque session token in PostgreSQL. The original token is sent through an `HttpOnly` cookie.

### Create a project

```powershell
$projectBody = @{
  name = "Portfolio Project"
  description = "Project created through the authenticated API."
} | ConvertTo-Json

$projectResponse = Invoke-WebRequest `
  -UseBasicParsing `
  -Method Post `
  -Uri "http://localhost:3000/projects" `
  -ContentType "application/json" `
  -Body $projectBody `
  -WebSession $nexoSession

$project = $projectResponse.Content | ConvertFrom-Json
```

Project creation and owner membership are committed in a single database transaction. The authenticated user becomes the owner automatically.

### Add a registered project member

The collaborator must already have an account created through `/auth/register`.

```powershell
$memberBody = @{
  email = "collaborator@example.com"
  role = "member"
} | ConvertTo-Json

Invoke-WebRequest `
  -UseBasicParsing `
  -Method Post `
  -Uri "http://localhost:3000/projects/$($project.id)/members" `
  -ContentType "application/json" `
  -Body $memberBody `
  -WebSession $nexoSession
```

The API resolves the user by normalized email. Clients cannot submit a `user_id` or assign the `owner` role.

### List project members

```powershell
Invoke-WebRequest `
  -UseBasicParsing `
  -Method Get `
  -Uri "http://localhost:3000/projects/$($project.id)/members" `
  -WebSession $nexoSession
```

### Get accessible tasks

```powershell
Invoke-WebRequest `
  -UseBasicParsing `
  -Method Get `
  -Uri "http://localhost:3000/tasks" `
  -WebSession $nexoSession
```

Only tasks from projects owned by or shared with the authenticated user are returned.

### Create a task

```powershell
$taskBody = @{
  project_id = $project.id
  title = "Review the API documentation"
  description = "Confirm the setup from a clean environment."
  priority = "high"
} | ConvertTo-Json

$taskResponse = Invoke-WebRequest `
  -UseBasicParsing `
  -Method Post `
  -Uri "http://localhost:3000/tasks" `
  -ContentType "application/json" `
  -Body $taskBody `
  -WebSession $nexoSession

$task = $taskResponse.Content | ConvertFrom-Json
```

The server assigns `created_by` from the authenticated session. Clients cannot choose or replace the creator.

### Update a task

```powershell
$updateBody = @{
  status = "completed"
  priority = "urgent"
} | ConvertTo-Json

Invoke-WebRequest `
  -UseBasicParsing `
  -Method Put `
  -Uri "http://localhost:3000/tasks/$($task.id)" `
  -ContentType "application/json" `
  -Body $updateBody `
  -WebSession $nexoSession
```

Nullable fields such as `description` and `assigned_to` can be cleared explicitly with `$null`. Non-null assignees must belong to the task's project.

### Sign out

```powershell
Invoke-WebRequest `
  -UseBasicParsing `
  -Method Post `
  -Uri "http://localhost:3000/auth/logout" `
  -WebSession $nexoSession
```

A successful logout deletes the database session, clears the cookie, and returns `204 No Content`.

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

The automated test suite currently includes 54 tests covering:

- Root endpoint and unknown-route behavior.
- Malformed JSON handling.
- Oversized JSON rejection with HTTP 413.
- Helmet security headers.
- Rate-limit enforcement with HTTP 429 and standard headers.
- OpenAPI security-response documentation.
- Authentication request schemas.
- Email normalization and privilege-injection rejection.
- Password hashing and timing-safe verification.
- Session-token generation and hashing.
- Login-protected routes.
- Logout cookie clearing.
- Task UUID and update validation.
- Strict task creation and update schemas.
- Rejection of client-controlled creator and project fields.

Run the suite once:

```bash
npm test
```

Run it in watch mode:

```bash
npm run test:watch
```

Database integration tests are planned as a separate testing layer.

## Continuous Integration

GitHub Actions runs the following checks on every push and pull request:

```text
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
docker compose config
docker build -t nexo-projects-api:ci .
```

The CI badge at the top of this README shows the current workflow status.

## Security Notes

Implemented:

- Password hashing with Node.js `scrypt`.
- Unique random password salts.
- Timing-safe password verification.
- Generic invalid-credential responses.
- Cryptographically random opaque session tokens.
- SHA-256 session-token hashes in PostgreSQL.
- Expiring database-backed sessions.
- `HttpOnly`, `SameSite=Lax` cookies.
- `Secure` cookies in production mode.
- Server-side logout and session deletion.
- Strict runtime request validation.
- HTTP security headers with Helmet.
- Global IP rate limiting and stricter authentication limits.
- JSON request bodies limited to 100 KB.
- Server-controlled creator identity.
- Project membership authorization.
- Owner, admin, and member permissions.
- Assignee membership validation.
- Parameterized SQL queries.
- Generic internal error responses.
- Environment-variable validation.
- Ignored local `.env` files.

Required before public production deployment:

- Explicit production CORS policy.
- CSRF protection appropriate for the frontend deployment.
- Production secret management.
- Shared rate-limit storage for multi-instance deployments.
- Trusted-proxy configuration for the selected hosting platform.
- HTTPS termination.
- Session cleanup scheduling.
- Security-focused integration testing.

## Roadmap

### Backend foundation

- [x] Express and TypeScript setup
- [x] PostgreSQL connection
- [x] Relational database schema
- [x] Database migration structure
- [x] Demonstration seed data
- [x] Task CRUD
- [x] Zod validation
- [x] Centralized error handling
- [x] ESLint and Prettier
- [x] Automated tests
- [x] GitHub Actions CI

### Authentication and authorization

- [x] User registration
- [x] Sign in and sign out
- [x] Password hashing with `scrypt`
- [x] Database-backed sessions
- [x] Secure authentication cookies
- [x] Authenticated current-user endpoint
- [x] Project membership authorization
- [x] Owner, admin, and member permissions
- [x] Server-controlled task creator identity
- [x] Assignee membership validation

### Core domain

- [x] Project CRUD endpoints
- [x] Project membership endpoints
- [ ] Comment endpoints
- [ ] Task pagination, filtering, sorting, and search
- [ ] Database integration tests

### Full-stack application

- [ ] React frontend
- [ ] Authentication pages
- [ ] Project dashboard
- [ ] Task forms and filters
- [ ] Kanban board
- [ ] Comments interface
- [ ] Responsive design

### Production readiness

- [x] OpenAPI documentation
- [x] Docker development environment
- [x] Rate limiting and security headers
- [ ] Structured application logging
- [ ] Cloud deployment

## License

This project is available under the [MIT License](LICENSE).
