const sessionSecurity = [
  {
    sessionCookie: [],
  },
];

const projectIdParameter = {
  name: "id",
  in: "path",
  required: true,
  description: "Project UUID",
  schema: {
    type: "string",
    format: "uuid",
  },
};

export const openApiProjectPaths = {
  "/projects": {
    get: {
      tags: ["Projects"],
      summary: "List accessible projects",
      description:
        "Returns projects where the authenticated user is an owner, admin, or member.",
      security: sessionSecurity,
      responses: {
        "200": {
          description: "Accessible projects",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ProjectWithRole",
                },
              },
            },
          },
        },
        "401": {
          $ref: "#/components/responses/Unauthorized",
        },
        "500": {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },

    post: {
      tags: ["Projects"],
      summary: "Create a project",
      description:
        "Creates a project and adds the authenticated user as its owner in one transaction.",
      security: sessionSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateProjectRequest",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Project created",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Project",
              },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
        "401": {
          $ref: "#/components/responses/Unauthorized",
        },
        "500": {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },
  },

  "/projects/{id}": {
    parameters: [projectIdParameter],

    get: {
      tags: ["Projects"],
      summary: "Get a project",
      description:
        "Returns a project only when the authenticated user belongs to it.",
      security: sessionSecurity,
      responses: {
        "200": {
          description: "Accessible project",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProjectWithRole",
              },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
        "401": {
          $ref: "#/components/responses/Unauthorized",
        },
        "404": {
          $ref: "#/components/responses/NotFound",
        },
        "500": {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },

    put: {
      tags: ["Projects"],
      summary: "Update a project",
      description:
        "Updates a project when the authenticated user is its owner or an admin.",
      security: sessionSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateProjectRequest",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Project updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Project",
              },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
        "401": {
          $ref: "#/components/responses/Unauthorized",
        },
        "403": {
          $ref: "#/components/responses/Forbidden",
        },
        "404": {
          $ref: "#/components/responses/NotFound",
        },
        "500": {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },

    delete: {
      tags: ["Projects"],
      summary: "Delete a project",
      description: "Deletes a project. Only its owner may perform this action.",
      security: sessionSecurity,
      responses: {
        "204": {
          description: "Project deleted",
        },
        "400": {
          $ref: "#/components/responses/ValidationError",
        },
        "401": {
          $ref: "#/components/responses/Unauthorized",
        },
        "403": {
          $ref: "#/components/responses/Forbidden",
        },
        "404": {
          $ref: "#/components/responses/NotFound",
        },
        "500": {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },
  },
};
