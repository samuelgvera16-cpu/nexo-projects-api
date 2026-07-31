import app from "./app.js";
import { pool } from "./config/database.js";

const PORT = 3000;

async function startServer() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("PostgreSQL conectado");
    console.log("Hora de PostgreSQL:", result.rows[0].now);

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a PostgreSQL");
    console.error(error);
  }
}

startServer();