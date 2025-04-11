// controllers/clienteController.js
const Cliente = require("../models/Cliente");
const Usuario = require("../models/Usuario");
const TipoMembresia = require("../models/TipoMembresia");
const obtenerClientesConInfo = async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["nombre", "email"],
                },
                {
                    model: TipoMembresia,
                    as: "tipoMembresia",
                    attributes: ["nombre"]
                }
            ],
            attributes: ["fecha_inicio", "fecha_fin","dni"]
        });

        res.json(clientes);
    } catch (error) {
        console.error("❌ Error al obtener clientes:", error);
        res.status(500).json({ error: "Error al obtener clientes" });
    }
};

module.exports = { obtenerClientesConInfo };
