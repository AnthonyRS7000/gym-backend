const Cliente = require("../models/Cliente");
const TipoMembresia = require("../models/TipoMembresia");
const Acceso = require("../models/Acceso");
const { Op } = require("sequelize");

const verificarAcceso = async (req, res, next) => {
    try {
        const usuarioId = req.user.id;

        // Buscar el cliente asociado al usuario con el alias corregido
        const cliente = await Cliente.findOne({
            where: { usuarioId },
            include: [{ model: TipoMembresia, as: "tipoMembresia" }]
        });

        if (!cliente || !cliente.tipoMembresia) {
            return res.status(403).json({ error: "No tienes una membresía activa" });
        }

        const { horario_restriccion, nombre } = cliente.tipoMembresia;
        const ahora = new Date();
        const diaActual = ahora.toLocaleString("es-ES", { weekday: "long" }).toLowerCase();
        const horaActual = ahora.getHours();

        // ❌ Verificar si el día está permitido
        if (!horario_restriccion.dias.includes(diaActual)) {
            return res.status(403).json({ error: "Acceso denegado: Día no permitido" });
        }

        // ❌ Verificar si la hora está permitida
        if (horario_restriccion.hora_maxima && horaActual >= parseInt(horario_restriccion.hora_maxima.split(":")[0])) {
            return res.status(403).json({ error: "Acceso denegado: Fuera del horario permitido" });
        }

        // 📌 Restricción para membresía interdiaria
        if (nombre.toLowerCase() === "básico") {
            const inicioSemana = new Date();
            inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay() + 1);
            inicioSemana.setHours(0, 0, 0, 0);

            const finSemana = new Date(inicioSemana);
            finSemana.setDate(inicioSemana.getDate() + 6);
            finSemana.setHours(23, 59, 59, 999);

            const accesosSemana = await Acceso.count({
                where: {
                    clienteId: cliente.id,
                    fecha: {
                        [Op.between]: [inicioSemana, finSemana],
                    },
                },
            });

            if (accesosSemana >= 3) {
                return res.status(403).json({ error: "Acceso denegado: Ya has ingresado 3 veces esta semana" });
            }
        }

        // ✅ Registrar acceso
        await Acceso.create({ clienteId: cliente.id });

        next();
    } catch (error) {
        console.error("❌ Error en la verificación de acceso:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = verificarAcceso;
