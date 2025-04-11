const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/verificarToken");
const { obtenerClientesConInfo } = require("../controllers/clienteController");

router.get("/clientes", obtenerClientesConInfo);
router.get("/clientes", verificarToken, obtenerClientesConInfo); // ahora está protegida

router.get("/clientes", async (req, res) => {
    try {
      // Obteniendo los parámetros de búsqueda desde la query
      const { nombre, dni } = req.query;
  
      // Realizar búsqueda con filtro
      const clientes = await Cliente.findAll({
        where: {
          ...(nombre && { "$usuario.nombre$": { [Op.like]: `%${nombre}%` } }), // Filtro por nombre
          ...(dni && { dni: { [Op.like]: `%${dni}%` } }) // Filtro por DNI
        },
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["nombre", "email"],
          },
          {
            model: TipoMembresia,
            as: "tipoMembresia",
            attributes: ["nombre"],
          },
        ],
      });
  
      res.json(clientes);
    } catch (error) {
      console.error("❌ Error al obtener clientes:", error.message);
      res.status(500).json({ error: "Error al obtener clientes" });
    }
  });
module.exports = router;
