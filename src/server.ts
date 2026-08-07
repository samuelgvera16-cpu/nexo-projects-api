import app from "./app.js";
import { pool } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

async function startServer(): Promise<void> {
  try {
    const result = await pool.query("SELECT NOW()");

    logger.info(
      {
        postgresTime: result.rows[0].now,
      },
      "PostgreSQL connected"
    );

    const server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
        },
        "Server started"
      );
    });

    let isShuttingDown = false;

    async function shutdown(signal: NodeJS.Signals): Promise<void> {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;

      logger.info(
        {
          signal,
        },
        "Shutdown signal received"
      );

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

        logger.info("Server and PostgreSQL closed");
      } catch (error) {
        logger.error(
          {
            err: error,
          },
          "Server shutdown failed"
        );

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
    logger.fatal(
      {
        err: error,
      },
      "PostgreSQL connection failed"
    );

    process.exitCode = 1;

    try {
      await pool.end();
    } catch (poolError) {
      logger.error(
        {
          err: poolError,
        },
        "PostgreSQL pool shutdown failed"
      );
    }
  }
}

void startServer();
