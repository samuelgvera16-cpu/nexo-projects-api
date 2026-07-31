# Nexo Projects

<p align="center">
  A full-stack project management platform for small teams to organize projects, members, tasks, priorities, deadlines, and collaboration in one place.
</p>

<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white">
  <img alt="Zod" src="https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
</p>

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Model](#database-model)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Example Requests](#example-requests)
- [Technical Decisions](#technical-decisions)
- [Security Considerations](#security-considerations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

**Nexo Projects** is a full-stack project management application built for small teams, agencies, freelancers, and growing businesses.

It provides a central workspace where users can create projects, manage members, assign tasks, define priorities, track progress, set deadlines, and discuss work through comments.

The project is designed as a production-oriented portfolio application rather than a basic CRUD demo. It demonstrates typed frontend and backend development, REST API design, relational database modeling, request validation, centralized error handling, authorization-ready architecture, and persistent PostgreSQL storage.

## The Problem

Small teams often manage work across disconnected tools such as spreadsheets, messaging apps, email threads, and personal notes. This creates several problems:

- Tasks are forgotten or duplicated.
- Responsibilities are unclear.
- Project progress is difficult to measure.
- Important decisions are lost in chat messages.
- Deadlines are not visible to the whole team.
- Access permissions become difficult to control as the team grows.

Nexo Projects solves this by keeping project data, team membership, tasks, priorities, statuses, deadlines, and comments in one structured system.

## Core Features

### Implemented foundation

- Create, read, update, and delete tasks.
- Store data persistently in PostgreSQL.
- Validate request bodies and URL parameters with Zod.
- Use UUID identifiers for database entities.
- Organize backend code into routes, controllers, services, and middleware.
- Return consistent HTTP status codes and JSON error responses.
- Protect database queries with parameterized SQL.
- Manage projects, members, tasks, and comments through a relational schema.

### Planned application features

- User registration and sign-in.
- Project creation and ownership.
- Project member invitations.
- Role-based permissions: `owner`, `admin`, and `member`.
- Task assignment, status, priority, and due dates.
- Project task filtering and search.
- Task comments and activity history.
- Dashboard statistics.
- Kanban board.
- Notifications and real-time updates.

## Tech Stack

### Frontend

- [React](https://react.dev/) — component-based user interface.
- [TypeScript](https://www.typescriptlang.org/) — static typing across the application.
- [Vite](https://vite.dev/) — frontend development and build tooling.
- [React Router](https://reactrouter.com/) — client-side routing.
- [TanStack Query](https://tanstack.com/query/latest) — server-state fetching, caching, and synchronization.

### Backend

- [Node.js](https://nodejs.org/) — JavaScript runtime.
- [Express](https://expressjs.com/) — REST API framework.
- [TypeScript](https://www.typescriptlang.org/) — typed backend development.
- [Zod](https://zod.dev/) — runtime validation for request bodies and route parameters.
- [node-postgres](https://node-postgres.com/) — PostgreSQL driver and connection pooling.
- [dotenv](https://github.com/motdotla/dotenv) — environment variable loading.

### Database and tooling

- [PostgreSQL](https://www.postgresql.org/) — relational database.
- [pgAdmin](https://www.pgadmin.org/) — PostgreSQL administration.
- [Git](https://git-scm.com/) — source control.
- [ESLint](https://eslint.org/) — code-quality checks.
- [Prettier](https://prettier.io/) — consistent formatting.

## Architecture

The application uses a separated frontend and backend architecture.

```text
┌──────────────────────────────────────────────────────────────┐
│                         Web Browser                          │
│                                                              │
│                    React + TypeScript                        │
│  Pages → Components → Hooks → API client → TanStack Query   │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               │ HTTPS / JSON
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    Express REST API                          │
│                                                              │
│  Routes                                                      │
│    ↓                                                         │
│  Validation middleware (Zod)                                 │
│    ↓                                                         │
│  Controllers                                                 │
│    ↓                                                         │
│  Services / business rules                                   │
│    ↓                                                         │
│  PostgreSQL connection pool                                  │
│                                                              │
│  Errors → centralized error middleware → JSON response       │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               │ Parameterized SQL
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                         PostgreSQL                           │
│                                                              │
│  users                                                       │
│  projects                                                    │
│  project_members                                             │
│  tasks                                                       │
│  comments                                                    │
└──────────────────────────────────────────────────────────────┘
```

### Backend request flow

```text
HTTP request
    │
    ▼
Route
    │
    ▼
Zod validation
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
PostgreSQL
    │
    ▼
JSON response
```

## Database Model

```text
USERS
  id PK
  │
  ├──────────── owns ────────────────┐
  │                                  ▼
  │                              PROJECTS
  │                                  │
  │                                  │ contains
  │                                  ▼
  │                                TASKS
  │                                  │
  │                                  │ has
  │                                  ▼
  └──────── writes ─────────────── COMMENTS

USERS ─────< PROJECT_MEMBERS >───── PROJECTS

USERS ───── creates / receives ──── TASKS
```

### Main relationships

- One user can own many projects.
- Users and projects have a many-to-many relationship through `project_members`.
- One project can contain many tasks.
- One user can create many tasks.
- One user can be assigned many tasks.
- One task can have many comments.
- One user can write many comments.

## Project Structure

A recommended monorepo-style structure is shown below:

```text
nexo-projects/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   ├── errors/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── .gitignore
├── LICENSE
└── README.md
```

The current backend can also remain in a separate `todo-api` repository while the frontend is developed in its own repository.

## Getting Started

### Prerequisites

Install the following software before continuing:

- [Node.js](https://nodejs.org/) LTS or newer.
- npm, included with Node.js.
- [PostgreSQL](https://www.postgresql.org/download/).
- [Git](https://git-scm.com/).
- [Visual Studio Code](https://code.visualstudio.com/) or another editor.

Verify the installation:

```bash
node --version
npm --version
git --version
psql --version
```

### Clone the repository

```bash
git clone https://github.com/samuelgvera16-cpu/nexo-projects-api/blob/main/README.md
cd nexo-projects
```

Replace `YOUR_USERNAME` with the GitHub account that owns the repository.

### Install backend dependencies

```bash
cd server
npm install
```

### Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

## Environment Variables

Create a `.env` file inside `server/`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_local_postgres_password
DB_NAME=project_manager

CLIENT_ORIGIN=http://localhost:5173
```

Do not commit `.env`.

The repository should include a safe template named `.env.example`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=project_manager

CLIENT_ORIGIN=http://localhost:5173
```

Recommended `.gitignore` entries:

```gitignore
node_modules/
dist/
.env
*.log
```

## Database Setup

### 1. Create the database

Using pgAdmin or `psql`:

```sql
CREATE DATABASE project_manager;
```

Connect to it:

```bash
psql -U postgres -d project_manager
```

### 2. Enable UUID generation

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### 3. Create the schema

Run the schema file:

```bash
psql -U postgres -d project_manager -f database/schema.sql
```

The schema should create:

```text
users
projects
project_members
tasks
comments
```

### 4. Optional seed data

```bash
psql -U postgres -d project_manager -f database/seed.sql
```

### 5. Confirm the tables

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected result:

```text
comments
project_members
projects
tasks
users
```

## Running the Application

### Start the backend

```bash
cd server
npm run dev
```

Expected output:

```text
PostgreSQL connected
Server running at http://localhost:3000
```

### Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

### Production builds

Backend:

```bash
cd server
npm run build
npm start
```

Frontend:

```bash
cd client
npm run build
npm run preview
```

## API Endpoints

Current task endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | Return all tasks |
| `GET` | `/tasks/:id` | Return one task by UUID |
| `POST` | `/tasks` | Create a task |
| `PUT` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |

Planned resource endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Create a user account |
| `POST` | `/auth/login` | Authenticate a user |
| `GET` | `/projects` | Return projects visible to the user |
| `POST` | `/projects` | Create a project |
| `GET` | `/projects/:id` | Return project details |
| `PUT` | `/projects/:id` | Update a project |
| `DELETE` | `/projects/:id` | Delete a project |
| `GET` | `/projects/:id/members` | Return project members |
| `POST` | `/projects/:id/members` | Add a project member |
| `GET` | `/tasks/:id/comments` | Return task comments |
| `POST` | `/tasks/:id/comments` | Create a task comment |

## Example Requests

The examples use `curl.exe`, which works consistently in Windows PowerShell.

### Get all tasks

```powershell
curl.exe "http://localhost:3000/tasks"
```

### Get one task

```powershell
curl.exe "http://localhost:3000/tasks/TASK_UUID"
```

### Create a task

Create `body.json`:

```json
{
  "project_id": "PROJECT_UUID",
  "created_by": "USER_UUID",
  "assigned_to": "USER_UUID",
  "title": "Build the project dashboard",
  "description": "Create the first version of the project overview page.",
  "priority": "high"
}
```

Send the request:

```powershell
curl.exe -X POST "http://localhost:3000/tasks" `
  -H "Content-Type: application/json" `
  --data-binary "@body.json"
```

### Update a task

Create `update.json`:

```json
{
  "title": "Finish the project dashboard",
  "status": "completed",
  "priority": "urgent"
}
```

Send the request:

```powershell
curl.exe -X PUT "http://localhost:3000/tasks/TASK_UUID" `
  -H "Content-Type: application/json" `
  --data-binary "@update.json"
```

### Delete a task

```powershell
curl.exe -i -X DELETE "http://localhost:3000/tasks/TASK_UUID"
```

A successful deletion returns:

```text
HTTP/1.1 204 No Content
```

### Test invalid UUID validation

```powershell
curl.exe -i "http://localhost:3000/tasks/not-a-valid-uuid"
```

Expected response:

```json
{
  "message": "Invalid parameters",
  "errors": [
    {
      "message": "The ID must be a valid UUID"
    }
  ]
}
```

## Technical Decisions

### TypeScript across the full stack

TypeScript is used in both the frontend and backend to reduce mismatches between components, request payloads, service functions, and database models.

Benefits include:

- Earlier error detection.
- Safer refactoring.
- Better editor assistance.
- Explicit API and domain models.
- Easier sharing of common types in a monorepo.

### PostgreSQL instead of in-memory storage

The first API version used an array for learning purposes. PostgreSQL replaces that temporary storage so data survives server restarts and relational constraints are enforced.

PostgreSQL was selected because the domain contains strong relationships:

- Users belong to projects.
- Projects contain tasks.
- Tasks have creators and assignees.
- Tasks contain comments.

### UUID primary keys

Entities use UUID values generated by PostgreSQL with `gen_random_uuid()`.

UUIDs avoid exposing predictable sequential IDs and work well when records may eventually be generated across multiple services or environments.

### Layered backend architecture

The backend follows this flow:

```text
routes → validation → controllers → services → PostgreSQL
```

Responsibilities are separated:

- **Routes** connect HTTP methods and paths to handlers.
- **Middleware** validates and transforms requests.
- **Controllers** translate HTTP requests into service calls.
- **Services** contain business logic and database operations.
- **Error middleware** creates consistent error responses.

This prevents route files and controllers from becoming large, tightly coupled modules.

### Runtime validation with Zod

TypeScript types disappear at runtime. External clients can still send invalid data.

Zod validates:

- Request bodies.
- UUID route parameters.
- Status values.
- Priority values.
- Required and optional fields.

Only validated input reaches controllers and PostgreSQL.

### Parameterized SQL

Database queries use placeholders:

```sql
SELECT *
FROM tasks
WHERE id = $1;
```

Values are passed separately:

```ts
await pool.query(query, [id]);
```

This avoids unsafe string concatenation and reduces SQL injection risk.

### PostgreSQL connection pool

The backend uses `Pool` from `pg` instead of creating a new database connection for every request.

Connection pooling improves resource usage and supports concurrent requests more efficiently.

### Centralized error handling

Controllers throw application errors instead of duplicating response logic:

```ts
throw new AppError("Task not found", 404);
```

The error middleware converts errors into consistent JSON responses.

It also handles malformed JSON and unexpected server errors.

### Database constraints

Important rules are enforced at the database level:

- Unique user email addresses.
- Valid foreign-key references.
- Valid project roles.
- Valid task statuses.
- Valid task priorities.
- Cascading deletion for dependent project data.
- Nullable task assignees with `ON DELETE SET NULL`.

Application validation improves error messages, while database constraints preserve data integrity.

### Index strategy

Indexes support common access patterns:

- Projects by owner.
- Projects by member.
- Tasks by project.
- Tasks by assignee.
- Tasks by project and status.
- Tasks by due date.
- Tasks by assignee and status.
- Comments by task and creation date.

Indexes are added for real query patterns rather than every column, because unnecessary indexes increase storage usage and write cost.

### HTTP status codes

The API uses standard semantics:

- `200 OK` for successful reads and updates.
- `201 Created` after creating a resource.
- `204 No Content` after deleting a resource.
- `400 Bad Request` for invalid input.
- `404 Not Found` for missing resources.
- `500 Internal Server Error` for unexpected failures.

## Security Considerations

The current project foundation includes validation and parameterized SQL, but production deployment should also add:

- Password hashing with Argon2 or bcrypt.
- Authentication using secure HttpOnly cookies.
- Role-based authorization checks.
- CORS restricted to approved origins.
- Rate limiting.
- Helmet security headers.
- Request body size limits.
- Input normalization.
- Secure production secrets.
- HTTPS.
- Database users with minimum required permissions.
- Audit logs for sensitive actions.

Never commit real database passwords, tokens, or production credentials.

## Roadmap

### Phase 1 — Backend foundation

- [x] Express and TypeScript setup.
- [x] PostgreSQL connection.
- [x] Relational database schema.
- [x] Task CRUD.
- [x] Zod request validation.
- [x] UUID parameter validation.
- [x] Centralized error handling.
- [x] Parameterized SQL queries.

### Phase 2 — Core project management

- [ ] User CRUD.
- [ ] Project CRUD.
- [ ] Project membership management.
- [ ] Comment CRUD.
- [ ] Project-specific task endpoints.
- [ ] Pagination, filtering, sorting, and search.

### Phase 3 — Authentication and authorization

- [ ] User registration.
- [ ] Sign-in and sign-out.
- [ ] Password hashing.
- [ ] HttpOnly session or access cookies.
- [ ] Owner, admin, and member authorization.
- [ ] Protected frontend routes.

### Phase 4 — Frontend

- [ ] Authentication pages.
- [ ] Project list and detail pages.
- [ ] Task creation and editing forms.
- [ ] Task filters.
- [ ] Project member interface.
- [ ] Comments interface.
- [ ] Dashboard metrics.
- [ ] Loading, empty, and error states.

### Phase 5 — Advanced capabilities

- [ ] Kanban board.
- [ ] File attachments.
- [ ] Notifications.
- [ ] Activity history.
- [ ] Real-time updates with WebSockets.
- [ ] Automated tests.
- [ ] OpenAPI documentation.
- [ ] Docker development environment.
- [ ] Continuous integration.
- [ ] Cloud deployment.

## Contributing

Contributions, bug reports, and suggestions are welcome.

1. Fork the repository.
2. Create a branch:

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes:

```bash
git commit -m "Add your feature"
```

4. Push the branch:

```bash
git push origin feature/your-feature-name
```

5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with React, TypeScript, Express, and PostgreSQL.
</p>
