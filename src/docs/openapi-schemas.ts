export const openApiSchemas = {
  RegisterRequest: {
    type: "object",
    additionalProperties: false,
    required: ["name", "email", "password"],
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 120,
        example: "Samuel Vera",
      },
      email: {
        type: "string",
        format: "email",
        maxLength: 254,
        example: "samuel@example.com",
      },
      password: {
        type: "string",
        format: "password",
        minLength: 12,
        maxLength: 128,
        example: "A secure password",
      },
    },
  },

  LoginRequest: {
    type: "object",
    additionalProperties: false,
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        maxLength: 254,
        example: "samuel@example.com",
      },
      password: {
        type: "string",
        format: "password",
        minLength: 1,
        maxLength: 128,
        example: "A secure password",
      },
    },
  },

  AuthResponse: {
    type: "object",
    required: ["user"],
    properties: {
      user: {
        $ref: "#/components/schemas/User",
      },
    },
  },

  User: {
    type: "object",
    required: ["id", "name", "email", "created_at", "updated_at"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
        example: "Samuel Vera",
      },
      email: {
        type: "string",
        format: "email",
        example: "samuel@example.com",
      },
      created_at: {
        type: "string",
        format: "date-time",
      },
      updated_at: {
        type: "string",
        format: "date-time",
      },
    },
  },

  Project: {
    type: "object",
    required: [
      "id",
      "owner_id",
      "name",
      "description",
      "created_at",
      "updated_at",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      owner_id: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
        example: "Portfolio platform",
      },
      description: {
        type: ["string", "null"],
        example: "A collaborative project for managing portfolio content.",
      },
      created_at: {
        type: "string",
        format: "date-time",
      },
      updated_at: {
        type: "string",
        format: "date-time",
      },
    },
  },

  ProjectWithRole: {
    allOf: [
      {
        $ref: "#/components/schemas/Project",
      },
      {
        type: "object",
        required: ["role"],
        properties: {
          role: {
            type: "string",
            enum: ["owner", "admin", "member"],
          },
        },
      },
    ],
  },

  ProjectMember: {
    type: "object",
    required: ["project_id", "user_id", "name", "email", "role", "joined_at"],
    properties: {
      project_id: {
        type: "string",
        format: "uuid",
      },
      user_id: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
        example: "Project Member",
      },
      email: {
        type: "string",
        format: "email",
        example: "member@example.com",
      },
      role: {
        type: "string",
        enum: ["owner", "admin", "member"],
      },
      joined_at: {
        type: "string",
        format: "date-time",
      },
    },
  },

  Task: {
    type: "object",
    required: [
      "id",
      "project_id",
      "assigned_to",
      "created_by",
      "title",
      "description",
      "status",
      "priority",
      "due_date",
      "created_at",
      "updated_at",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      project_id: {
        type: "string",
        format: "uuid",
      },
      assigned_to: {
        type: ["string", "null"],
        format: "uuid",
      },
      created_by: {
        type: "string",
        format: "uuid",
      },
      title: {
        type: "string",
        example: "Document the API",
      },
      description: {
        type: ["string", "null"],
        example: "Add OpenAPI documentation for every endpoint.",
      },
      status: {
        type: "string",
        enum: ["todo", "in_progress", "completed", "cancelled"],
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high", "urgent"],
      },
      due_date: {
        type: ["string", "null"],
        format: "date-time",
      },
      created_at: {
        type: "string",
        format: "date-time",
      },
      updated_at: {
        type: "string",
        format: "date-time",
      },
    },
  },

  Error: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        example: "Recurso no encontrado",
      },
    },
  },

  ValidationError: {
    type: "object",
    required: ["message", "errors"],
    properties: {
      message: {
        type: "string",
        example: "Datos inválidos",
      },
      errors: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
  },
};
