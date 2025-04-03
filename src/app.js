const express = require("express");
const { connectDB, sequelize } = require("./config/db");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // Permitir solo el frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

// Conectar BD
connectDB();

// Importar modelos antes de sincronizar
require("./models/Usuario");
require("./models/Cliente");
require("./models/Entrenador");
require("./models/Administrador");
require("./models/Membresia");
require("./models/TipoMembresia");
require("./models/Asistencia");

// Sincronizar modelos con la BD
sequelize.sync({ alter: true })  // ⚠️ Esto crea/actualiza las tablas
    .then(() => console.log("✅ Tablas sincronizadas en MySQL"))
    .catch((error) => console.error("❌ Error al sincronizar tablas:", error));

// Rutas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/asistencia", require("./routes/asistenciaRoutes")); // 👈 Nueva ruta agregada

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`));
