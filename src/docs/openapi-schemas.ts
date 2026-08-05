export const openApiSchemas = {
  ApiInfo: {
    type: "object",
    required: ["mensaje", "version"],
    properties: {
      mensaje: {
        type: "string",
        example: "Hola desde Express + TypeScript 🚀",
      },
      version: {
        type: "string",
        example: "1.0.0",
      },
    },
  },

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

  CreateProjectRequest: {
    type: "object",
    additionalProperties: false,
    required: ["name"],
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 150,
        example: "Portfolio platform",
      },
      description: {
        type: ["string", "null"],
        maxLength: 2000,
        example: "A collaborative platform for managing portfolio content.",
      },
    },
  },

  UpdateProjectRequest: {
    type: "object",
    additionalProperties: false,
    minProperties: 1,
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 150,
        example: "Updated portfolio platform",
      },
      description: {
        type: ["string", "null"],
        maxLength: 2000,
        example: "Updated project description.",
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

  AddProjectMemberRequest: {
    type: "object",
    additionalProperties: false,
    required: ["email"],
    properties: {
      email: {
        type: "string",
        format: "email",
        maxLength: 254,
        example: "member@example.com",
      },
      role: {
        type: "string",
        enum: ["admin", "member"],
        default: "member",
      },
    },
  },

  UpdateProjectMemberRoleRequest: {
    type: "object",
    additionalProperties: false,
    required: ["role"],
    properties: {
      role: {
        type: "string",
        enum: ["admin", "member"],
      },
    },
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

  CreateTaskRequest: {
    type: "object",
    additionalProperties: false,
    required: ["project_id", "title"],
    properties: {
      project_id: {
        type: "string",
        format: "uuid",
      },
      assigned_to: {
        type: ["string", "null"],
        format: "uuid",
      },
      title: {
        type: "string",
        minLength: 1,
        maxLength: 200,
        example: "Document the API",
      },
      description: {
        type: ["string", "null"],
        example: "Add OpenAPI documentation for every endpoint.",
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high", "urgent"],
        example: "high",
      },
    },
  },

  UpdateTaskRequest: {
    type: "object",
    additionalProperties: false,
    minProperties: 1,
    properties: {
      title: {
        type: "string",
        minLength: 1,
        maxLength: 200,
        example: "Complete the API documentation",
      },
      description: {
        type: ["string", "null"],
        example: "Verify every documented response.",
      },
      assigned_to: {
        type: ["string", "null"],
        format: "uuid",
      },
      status: {
        type: "string",
        enum: ["todo", "in_progress", "completed", "cancelled"],
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high", "urgent"],
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
