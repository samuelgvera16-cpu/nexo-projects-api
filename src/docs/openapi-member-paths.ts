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

const userIdParameter = {
  name: "userId",
  in: "path",
  required: true,
  description: "Member user UUID",
  schema: {
    type: "string",
    format: "uuid",
  },
};

export const openApiMemberPaths = {
  "/projects/{id}/members": {
    parameters: [projectIdParameter],

    get: {
      tags: ["Project members"],
      summary: "List project members",
      description:
        "Returns project members when the authenticated user belongs to the project.",
      security: sessionSecurity,
      responses: {
        "200": {
          description: "Project members",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ProjectMember",
                },
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

    post: {
      tags: ["Project members"],
      summary: "Add a project member",
      description:
        "Adds a registered user by email. Owners may add admins or members; admins may add members.",
      security: sessionSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AddProjectMemberRequest",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Project member added",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProjectMember",
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
        "409": {
          $ref: "#/components/responses/Conflict",
        },
        "500": {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },
  },

  "/projects/{id}/members/{userId}": {
    parameters: [projectIdParameter, userIdParameter],

    patch: {
      tags: ["Project members"],
      summary: "Change a project member role",
      description:
        "Changes a member between admin and member. Only the project owner may perform this action.",
      security: sessionSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateProjectMemberRoleRequest",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Project member role updated",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProjectMember",
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
      tags: ["Project members"],
      summary: "Remove a project member",
      description:
        "Owners may remove admins or members. Admins may remove members. The owner cannot be removed.",
      security: sessionSecurity,
      responses: {
        "204": {
          description: "Project member removed",
        },
        "400": {
          $ref: "#/components/responses/BadRequest",
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
