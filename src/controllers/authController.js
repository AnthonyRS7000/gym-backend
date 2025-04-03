const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // 🔑 Importación agregada
const Usuario = require("../models/Usuario");
const Cliente = require("../models/Cliente");
const TipoMembresia = require("../models/TipoMembresia");

exports.loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // Verificar contraseña
        const esPasswordValido = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValido) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // Generar token
        const token = jwt.sign({ id: usuario.id, email: usuario.email }, "clave_secreta", {
            expiresIn: "1h",
        });
        

        // Enviar respuesta con el token
        res.json({ mensaje: "Inicio de sesión exitoso", token, usuario });
    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.registrarUsuario = async (req, res) => {
    try {
        console.log("📩 Recibiendo solicitud de registro:", req.body);

        const { nombre, email, password, confirm_password, telefono, direccion, fecha_nacimiento, tipoMembresiaId, genero, peso, estatura, rol } = req.body;

        if (!nombre || !email || !password || !confirm_password || !telefono || !direccion || !fecha_nacimiento || !tipoMembresiaId || !genero || !rol) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        if (password !== confirm_password) {
            return res.status(400).json({ error: "Las contraseñas no coinciden" });
        }

        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: "El email ya está en uso" });
        }

        const membresiaExistente = await TipoMembresia.findByPk(tipoMembresiaId);
        if (!membresiaExistente) {
            return res.status(400).json({ error: "El tipo de membresía no es válido" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔥 Asegurar que el rol es válido antes de asignarlo
        const rolesPermitidos = ["cliente", "administrador", "entrenador", "empleado"];
        const rolAsignado = rolesPermitidos.includes(rol) ? rol : "cliente";

        // 🔥 Crear el usuario con el rol correcto
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rol: rolAsignado
        });

        const generoNormalizado = genero === "masculino" ? "M" : genero === "femenino" ? "F" : genero;

        // 🔥 Crear cliente sin el rol (porque ya está en Usuario)
        const nuevoCliente = await Cliente.create({
            usuarioId: nuevoUsuario.id,
            telefono,
            direccion,
            fecha_nacimiento,
            genero: generoNormalizado,
            peso,
            tipoMembresiaId,
            estatura
        });

        console.log("✅ Usuario y cliente registrados correctamente");

        res.status(201).json({ mensaje: "Usuario registrado correctamente", usuario: nuevoUsuario });

    } catch (error) {
        console.error("❌ Error en el servidor:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};