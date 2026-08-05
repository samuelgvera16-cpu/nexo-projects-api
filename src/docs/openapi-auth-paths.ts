export const openApiAuthPaths = {
  "/auth/register": {
    post: {
      tags: ["Authentication"],
      summary: "Register a user",
      description:
        "Creates a user account. The email is normalized before storage.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegisterRequest",
            },
          },
        },
      },
      responses: {
        "201": {
          description: "User created",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "400": {
          description: "Invalid request body",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationError",
              },
            },
          },
        },
        "409": {
          description: "Email already registered",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },

  "/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "Log in",
      description:
        "Verifies the credentials and creates an HttpOnly session cookie.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginRequest",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login successful",
          headers: {
            "Set-Cookie": {
              description: "HttpOnly session cookie",
              schema: {
                type: "string",
                example: "nexo_session=token; Path=/; HttpOnly; SameSite=Lax",
              },
            },
          },
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "400": {
          description: "Invalid request body",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationError",
              },
            },
          },
        },
        "401": {
          description: "Invalid credentials",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },

  "/auth/me": {
    get: {
      tags: ["Authentication"],
      summary: "Get the current user",
      security: [
        {
          sessionCookie: [],
        },
      ],
      responses: {
        "200": {
          description: "Authenticated user",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "401": {
          description: "Authentication required",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },

  "/auth/logout": {
    post: {
      tags: ["Authentication"],
      summary: "Log out",
      description:
        "Deletes the current server-side session when present and clears the session cookie.",
      responses: {
        "204": {
          description: "Session ended",
        },
      },
    },
  },
};
