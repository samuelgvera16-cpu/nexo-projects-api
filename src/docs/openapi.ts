import { openApiSchemas } from "./openapi-schemas.js";

import { openApiAuthPaths } from "./openapi-auth-paths.js";

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
    ...openApiAuthPaths,
  },
  components: {
    schemas: openApiSchemas,

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
