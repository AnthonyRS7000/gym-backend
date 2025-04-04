const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Verificamos si viene un token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "clave_secreta"); // usa la misma clave que usás al generar el token
        req.usuario = decoded; // guardamos info del usuario en req
        next(); // sigue con la ruta protegida
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
};

module.exports = verificarToken;
