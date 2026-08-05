export const openApiResponses = {
  BadRequest: {
    description: "Invalid request",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Error",
        },
      },
    },
  },

  ValidationError: {
    description: "Request validation failed",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ValidationError",
        },
      },
    },
  },

  Unauthorized: {
    description: "Authentication required",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Error",
        },
      },
    },
  },

  Forbidden: {
    description: "Insufficient permissions",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Error",
        },
      },
    },
  },

  NotFound: {
    description: "Resource not found",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Error",
        },
      },
    },
  },

  Conflict: {
    description: "Resource conflict",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Error",
        },
      },
    },
  },

  InternalServerError: {
    description: "Unexpected server error",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Error",
        },
      },
    },
  },
};
