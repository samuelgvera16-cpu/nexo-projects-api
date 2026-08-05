export const openApiSystemPaths = {
  "/": {
    get: {
      tags: ["System"],
      summary: "Get API information",
      responses: {
        "200": {
          description: "API information",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ApiInfo",
              },
            },
          },
        },
      },
    },
  },

  "/openapi.json": {
    get: {
      tags: ["System"],
      summary: "Download the OpenAPI document",
      responses: {
        "200": {
          description: "OpenAPI 3.1 document",
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
      },
    },
  },
};
