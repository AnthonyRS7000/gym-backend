const express = require("express");
const router = express.Router();
const { registrarAsistencia, obtenerAsistencias } = require("../controllers/asistenciaController");

router.post("/registrar-asistencia", registrarAsistencia);
// Ruta para obtener todas las asistencias
router.get('/asistencias', obtenerAsistencias);
module.exports = router;
