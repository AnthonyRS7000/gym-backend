const express = require("express");
const verificarAcceso = require("../middlewares/restriccionAcceso");

const router = express.Router();

router.post("/ingresar", verificarAcceso, (req, res) => {
    res.json({ mensaje: "✅ Acceso permitido. Bienvenido al gimnasio." });
});

module.exports = router;
