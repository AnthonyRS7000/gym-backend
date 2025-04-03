const { Op } = require("sequelize");
const Asistencia = require("../models/Asistencia");
const Cliente = require("../models/Cliente");
const Usuario = require("../models/Usuario");
const TipoMembresia = require("../models/TipoMembresia");

exports.registrarAsistencia = async (req, res) => {
    try {
        console.log("📩 Datos recibidos:", req.body);  // 🔍 Depuración

        const { usuarioId } = req.body;

        if (!usuarioId) {
            return res.status(400).json({ error: "El usuarioId es requerido" });
        }

        // Buscar al usuario e incluir Cliente y su TipoMembresia
        const cliente = await Cliente.findOne({
            where: { usuarioId },
            include: [
                {
                    model: TipoMembresia,
                    as: "tipoMembresia"
                }
            ]
        });

        if (!cliente) {
            return res.status(403).json({ error: "El usuario no tiene un perfil de cliente registrado" });
        }

        if (!cliente.tipoMembresia) {
            return res.status(403).json({ error: "No tienes una membresía activa" });
        }

        console.log("📌 Datos de la membresía:", cliente.tipoMembresia);

        const horarioRestriccion = cliente.tipoMembresia.horario_restriccion; // 🔹 Asegurar el acceso correcto
        const ahora = new Date();
        const horaActual = ahora.getHours();

        if (horarioRestriccion && horarioRestriccion.hora_maxima) {
            const horaMaxima = parseInt(horarioRestriccion.hora_maxima.split(":")[0]);

            if (horaActual >= horaMaxima) {
                return res.status(403).json({
                    error: `Acceso denegado: Tu membresía solo permite ingresar hasta las ${horarioRestriccion.hora_maxima}`
                });
            }
        }

        // Registrar la asistencia
        const asistencia = await Asistencia.create({
            clienteId: cliente.id,  // 🔹 Usamos cliente.id en lugar de usuarioId
            fechaHora: ahora
        });

        return res.status(200).json({
            mensaje: "Asistencia registrada exitosamente",
            asistencia
        });

    } catch (error) {
        console.error("❌ Error al registrar asistencia:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// **Nuevo controlador para obtener todas las asistencias**
exports.obtenerAsistencias = async (req, res) => {
    try {
        const asistencias = await Asistencia.findAll({
            include: [
                {
                    model: Cliente,  
                    include: [
                        {
                            model: Usuario,
                            as: "usuario",  // ✅ Especificamos el alias correcto
                            attributes: ['id', 'rol', 'nombre']
                        }
                    ]
                }
            ],
            order: [['fechaHora', 'DESC']]
        });

        if (asistencias.length === 0) {
            return res.status(404).json({ mensaje: "No se han registrado asistencias aún." });
        }

        return res.status(200).json({ asistencias });

    } catch (error) {
        console.error("❌ Error al obtener asistencias:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};