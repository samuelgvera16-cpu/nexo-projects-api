import { openApiSchemas } from "./openapi-schemas.js";

import { openApiAuthPaths } from "./openapi-auth-paths.js";

import { openApiResponses } from "./openapi-responses.js";

import { openApiProjectPaths } from "./openapi-project-paths.js";

import { openApiMemberPaths } from "./openapi-member-paths.js";

import { openApiTaskPaths } from "./openapi-task-paths.js";

import { openApiSystemPaths } from "./openapi-system-paths.js";

export const openApiDocument = {
  openapi: "3.1.0",

  info: {
    title: "Nexo Projects API",
    version: "1.0.0",
    description:
      "REST API for managing users, projects, project memberships, and tasks.",
    license: {
      name: "MIT",
      identifier: "MIT",
    },
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],

  tags: [
    {
      name: "System",
      description: "API status and general information",
    },
    {
      name: "Authentication",
      description: "Registration, login, session, and logout",
    },
    {
      name: "Projects",
      description: "Project management",
    },
    {
      name: "Project members",
      description: "Project membership and role management",
    },
    {
      name: "Tasks",
      description: "Task management",
    },
  ],

  paths: {
    ...openApiSystemPaths,
    ...openApiAuthPaths,
    ...openApiProjectPaths,
    ...openApiMemberPaths,
    ...openApiTaskPaths,
  },

  components: {
    schemas: openApiSchemas,
    responses: openApiResponses,

    securitySchemes: {
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "nexo_session",
        description: "HttpOnly authentication session cookie",
      },
    },
  },
};
