const sessionSecurity = [
  {
    sessionCookie: [],
  },
];

const taskIdParameter = {
  name: "id",
  in: "path",
  required: true,
  description: "Task UUID",
  schema: {
    type: "string",
    format: "uuid",
  },
};

export const openApiTaskPaths = {
  "/tasks": {
    get: {
      tags: ["Tasks"],
      summary: "List accessible tasks",
      description:
        "Returns tasks belonging to projects where the authenticated user is a member.",
      security: sessionSecurity,
      responses: {
        "200": {
          description: "Accessible tasks",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Task",
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
      tags: ["Tasks"],
      summary: "Create a task",
      description:
        "Creates a task in an accessible project. The creator identity is taken from the authenticated session.",
      security: sessionSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateTaskRequest",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Task created",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Task",
              },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/BadRequest",
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
  },

  "/tasks/{id}": {
    parameters: [taskIdParameter],

    get: {
      tags: ["Tasks"],
      summary: "Get a task",
      description:
        "Returns a task only when the authenticated user belongs to its project.",
      security: sessionSecurity,
      responses: {
        "200": {
          description: "Accessible task",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Task",
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
      tags: ["Tasks"],
      summary: "Update a task",
      description:
        "Updates a task when the authenticated user belongs to its project. An assignee must also belong to the project.",
      security: sessionSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateTaskRequest",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Task updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Task",
              },
            },
          },
        },
        "400": {
          $ref: "#/components/responses/BadRequest",
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

    delete: {
      tags: ["Tasks"],
      summary: "Delete a task",
      description:
        "Deletes a task when the authenticated user is an owner or admin of its project.",
      security: sessionSecurity,
      responses: {
        "204": {
          description: "Task deleted",
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
