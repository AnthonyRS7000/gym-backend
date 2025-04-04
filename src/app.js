const express = require("express");
const { connectDB, sequelize } = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const cron = require('node-cron'); // 👈 Importar node-cron

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
require("./models/TipoMembresia");
require("./models/Notificacion"); // NUEVO modelo aquí

// Sincronizar modelos con la BD
sequelize.sync({ alter: true })  // ⚠️ Esto crea/actualiza las tablas
    .then(() => console.log("✅ Tablas sincronizadas en MySQL"))
    .catch((error) => console.error("❌ Error al sincronizar tablas:", error));

// Importar rutas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/asistencia", require("./routes/asistenciaRoutes")); // Nueva ruta agregada
app.use("/api", require("./routes/cliente"));
app.use("/api/notificaciones", require("./routes/notificaciones"));

// Programar la tarea para ejecutar la generación de notificaciones todos los días a las 12:00 AM
// Programar la tarea para ejecutar la generación de notificaciones todos los días a las 12:00 AM
cron.schedule('0 0 * * *', () => {
    console.log('🌙 Ejecutando la tarea de generar notificaciones...');
    
    // Llamar a la función que genera las notificaciones
    const { generarNotificacionesMembresias } = require("./controllers/notificacionController");
    
    generarNotificacionesMembresias({}, { // Llamada al controlador (req y res simulados)
        json: (response) => {
            console.log("✅ Notificaciones generadas automáticamente:", response);
        }
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`));
