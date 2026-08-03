import app from "./app.js";
import { pool } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("PostgreSQL conectado");
    console.log("Hora de PostgreSQL:", result.rows[0].now);

    app.listen(env.PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a PostgreSQL");
    console.error(error);
  }
}

startServer();