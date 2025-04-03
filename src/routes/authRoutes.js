const express = require("express");
const { registrarUsuario, loginUsuario } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", loginUsuario); // ✅ La ruta está correctamente definida

module.exports = router;
