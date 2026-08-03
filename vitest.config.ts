import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: {
      NODE_ENV: "test",
      PORT: "3001",
      DB_HOST: "localhost",
      DB_PORT: "5432",
      DB_USER: "postgres",
      DB_PASSWORD: "test_password",
      DB_NAME: "nexo_projects_test",
    },
  },
});
