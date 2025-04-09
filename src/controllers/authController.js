const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const Cliente = require("../models/Cliente");
const TipoMembresia = require("../models/TipoMembresia");
const Administrador = require('../models/Administrador'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();
const today = new Date();
const fecha_inicio = today.toISOString().split('T')[0];

const fecha_fin_obj = new Date();
fecha_fin_obj.setDate(today.getDate() + 30);
const fecha_fin = fecha_fin_obj.toISOString().split('T')[0];
exports.loginAdministrador = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son obligatorios" });
        }

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Validar rol de administrador
        if (usuario.rol !== "administrador") {
            return res.status(403).json({ error: "Acceso denegado: No es administrador" });
        }

        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Verificamos que tenga relación en la tabla Administrador
        const admin = await Administrador.findOne({ where: { usuarioId: usuario.id } });
        if (!admin) {
            return res.status(404).json({ error: "Administrador no registrado correctamente" });
        }

        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            }
        });

    } catch (error) {
        console.error("❌ Error al iniciar sesión:", error);
        res.status(500).json({ error: error.message || "Error en el servidor" });
    }
};

// ✅ LOGIN
exports.loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({
            where: { email },
            include: {
                model: Cliente,
                as: "cliente"
            }
        });

        if (!usuario) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const esPasswordValido = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValido) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            "clave_secreta",
            { expiresIn: "1h" }
        );

        const clienteId = usuario.cliente?.id || null;

        res.json({
            mensaje: "Inicio de sesión exitoso",
            token,
            nombre: usuario.nombre,
            rol: usuario.rol,
            clienteId
        });

    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// ✅ REGISTRO ADMIN
// Registrar Administrador
// ✅ REGISTRO DE ADMINISTRADOR
exports.registrarAdministrador = async (req, res) => {
    try {
        console.log("📩 Recibiendo solicitud de registro de administrador:", req.body);

        const { nombre, email, password, confirm_password, rol } = req.body;

        // Validar que todos los campos estén presentes
        if (!nombre || !email || !password || !confirm_password || !rol) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Verificar que las contraseñas coinciden
        if (password !== confirm_password) {
            return res.status(400).json({ error: "Las contraseñas no coinciden" });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: "El email ya está en uso" });
        }

        // Asegurarse de que el rol sea 'administrador'
        if (rol !== "administrador") {
            return res.status(400).json({ error: "El rol debe ser 'administrador'" });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rol: "administrador" // Asegurarse de que sea administrador
        });

        // Registrar al administrador en la tabla Administrador
        const nuevoAdministrador = await Administrador.create({
            usuarioId: nuevoUsuario.id
        });

        console.log("🛠️ Administrador registrado con ID:", nuevoAdministrador.id);

        // Respuesta de éxito
        res.status(201).json({
            mensaje: "Administrador registrado correctamente",
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            }
        });

    } catch (error) {
        console.error("❌ Error en el servidor:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};


// ✅ REGISTRO
exports.registrarUsuario = async (req, res) => {
    try {
        console.log("📩 Recibiendo solicitud de registro:", req.body);

        const {
            nombre,
            email,
            password,
            confirm_password,
            telefono,
            direccion,
            fecha_nacimiento,
            tipoMembresiaId,
            genero,
            peso,
            estatura,
            rol
        } = req.body;

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
        const rolesPermitidos = ["cliente", "administrador", "entrenador", "empleado"];
        const rolAsignado = rolesPermitidos.includes(rol) ? rol : "cliente";

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rol: rolAsignado
        });

        const generoNormalizado = genero === "masculino" ? "M" : genero === "femenino" ? "F" : genero;

        // 👉 Registrar en la tabla Cliente o Administrador según el rol
        let clienteId = null;
        if (rolAsignado === "cliente") {
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
            clienteId = nuevoCliente.id;
        } else if (rolAsignado === "administrador") {
            const nuevoAdministrador = await Administrador.create({
                usuarioId: nuevoUsuario.id
            });
            console.log("🛠️ Administrador registrado con ID:", nuevoAdministrador.id);
        }

        console.log("✅ Usuario registrado correctamente");

        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            },
            clienteId
        });

    } catch (error) {
        console.error("❌ Error en el servidor:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

