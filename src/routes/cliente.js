const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/verificarToken");
const { obtenerClientesConInfo } = require("../controllers/clienteController");

router.get("/clientes", obtenerClientesConInfo);
router.get("/clientes", verificarToken, obtenerClientesConInfo); // ahora está protegida
module.exports = router;
