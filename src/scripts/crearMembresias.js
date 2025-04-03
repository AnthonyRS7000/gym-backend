const { sequelize } = require("../config/db");
const TipoMembresia = require("../models/TipoMembresia");

const crearMembresias = async () => {
    try {
        await sequelize.sync();

        const membresias = [
            {
                nombre: "Básico",
                precio: 50.00,
                duracion_dias: 30,
                descripcion: "Acceso lunes, miércoles y viernes.",
                horario_restriccion: { dias: ["lunes", "miércoles", "viernes"] },
            },
            {
                nombre: "Estudiante",
                precio: 70.00,
                duracion_dias: 30,
                descripcion: "Acceso de lunes a viernes.",
                horario_restriccion: { dias: ["lunes", "martes", "miércoles", "jueves", "viernes"] },
            },
            {
                nombre: "Intermedio",
                precio: 90.00,
                duracion_dias: 30,
                descripcion: "Acceso de lunes a sábado hasta las 4 PM.",
                horario_restriccion: { dias: ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], hora_maxima: "16:00" },
            },
            {
                nombre: "Clásico",
                precio: 120.00,
                duracion_dias: 30,
                descripcion: "Acceso de lunes a sábado.",
                horario_restriccion: { dias: ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"] },
            },
            {
                nombre: "Premium",
                precio: 150.00,
                duracion_dias: 30,
                descripcion: "Acceso todos los días.",
                horario_restriccion: { dias: ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"] },
            },
        ];

        for (const membresia of membresias) {
            await TipoMembresia.findOrCreate({
                where: { nombre: membresia.nombre },
                defaults: membresia,
            });
        }

        console.log("✅ Membresías creadas correctamente.");
        process.exit();
    } catch (error) {
        console.error("❌ Error al crear membresías:", error);
        process.exit(1);
    }
};

crearMembresias();
