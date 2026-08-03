import app from "./app.js";
import { pool } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer(): Promise<void> {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("PostgreSQL conectado");
    console.log("Hora de PostgreSQL:", result.rows[0].now);

    const server = app.listen(env.PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${env.PORT}`);
    });

    let isShuttingDown = false;

    async function shutdown(signal: NodeJS.Signals): Promise<void> {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;

      console.log(`Señal ${signal} recibida. Cerrando servidor...`);

      try {
        await new Promise<void>((resolve, reject) => {
          server.close((error) => {
            if (error) {
              reject(error);
              return;
            }

            resolve();
          });
        });

        await pool.end();

        console.log("Servidor y PostgreSQL cerrados correctamente");
      } catch (error) {
        console.error("Error durante el cierre del servidor");
        console.error(error);

        process.exitCode = 1;
      }
    }

    process.once("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.once("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  } catch (error) {
    console.error("No se pudo conectar a PostgreSQL");
    console.error(error);

    process.exitCode = 1;

    try {
      await pool.end();
    } catch (poolError) {
      console.error("No se pudo cerrar el pool de PostgreSQL");
      console.error(poolError);
    }
  }
}

void startServer();