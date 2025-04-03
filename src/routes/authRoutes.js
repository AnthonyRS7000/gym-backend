const express = require("express");
const { registrarUsuario, loginUsuario } = require("../controllers/authController");
const TipoMembresia = require("../models/TipoMembresia");

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", loginUsuario); // ✅ La ruta está correctamente definida
router.get("/membresias", async (req, res) => {
    try {
        const membresias = await TipoMembresia.findAll({
            attributes: ["id", "nombre"]  // Solo obtenemos id y nombre
        });
        res.json(membresias);
    } catch (error) {
        console.error("❌ Error obteniendo membresías:", error);
        res.status(500).json({ error: "Error al obtener las membresías" });
    }
});
module.exports = router;
