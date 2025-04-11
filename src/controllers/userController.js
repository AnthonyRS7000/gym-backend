const { sequelize } = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        const [usuarios] = await sequelize.query(
            'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?',
            { replacements: [req.usuario.id], type: sequelize.QueryTypes.SELECT }
        );

        if (!usuarios) return res.status(404).json({ message: 'Usuario no encontrado' });

        let datosExtra = null;

        if (usuarios.rol === 'cliente') {
            const [clientes] = await sequelize.query(
                'SELECT telefono, direccion,dni, fecha_nacimiento, genero, peso, estatura, tipoMembresiaId FROM clientes WHERE usuarioId = ?',
                { replacements: [usuarios.id], type: sequelize.QueryTypes.SELECT }
            );
            datosExtra = clientes || null;
        } else if (usuarios.rol === 'entrenador') {
            const [entrenadores] = await sequelize.query(
                'SELECT telefono, especialidad, experiencia FROM entrenadores WHERE usuarioId = ?',
                { replacements: [usuarios.id], type: sequelize.QueryTypes.SELECT }
            );
            datosExtra = entrenadores || null;
        } else if (usuarios.rol === 'administrador') {
            const [admins] = await sequelize.query(
                'SELECT createdAt, updatedAt FROM administradores WHERE usuarioId = ?',
                { replacements: [usuarios.id], type: sequelize.QueryTypes.SELECT }
            );
            datosExtra = admins || null;
        }

        res.json({ ...usuarios, datosExtra });

    } catch (err) {
        console.error('Error al obtener perfil:', err);
        res.status(500).json({ message: 'Error al obtener perfil' });
    }
};



exports.updateProfile = async (req, res) => {
    const {
        nombre,
        telefono,
        direccion,
        dni,
        fecha_nacimiento,
        genero,
        peso,
        estatura,
        especialidad,
        experiencia
    } = req.body;

    const userId = req.usuario.id; // ← usamos "usuario" como lo tenés en el middleware

    try {
        // 1. Actualizar tabla 'usuarios'
        await sequelize.query(
            'UPDATE usuarios SET nombre = ? WHERE id = ?',
            {
                replacements: [nombre, userId],
                type: sequelize.QueryTypes.UPDATE
            }
        );

        // 2. Obtener el rol del usuario
        const [resultado] = await sequelize.query(
            'SELECT rol FROM usuarios WHERE id = ?',
            {
                replacements: [userId],
                type: sequelize.QueryTypes.SELECT
            }
        );

        const rol = resultado.rol;

        // 3. Actualizar tabla correspondiente según el rol
        if (rol === 'cliente') {
            await sequelize.query(
                `UPDATE clientes SET telefono = ?, direccion?, dni = ?, fecha_nacimiento = ?, genero = ?, peso = ?, estatura = ? WHERE usuarioId = ?`,
                {
                    replacements: [telefono, direccion,dni, fecha_nacimiento, genero, peso, estatura, userId],
                    type: sequelize.QueryTypes.UPDATE
                }
            );
        } else if (rol === 'entrenador') {
            await sequelize.query(
                `UPDATE entrenadores SET telefono = ?, especialidad = ?, experiencia = ? WHERE usuarioId = ?`,
                {
                    replacements: [telefono, especialidad, experiencia, userId],
                    type: sequelize.QueryTypes.UPDATE
                }
            );
        }

        res.json({ message: 'Perfil actualizado correctamente' });

    } catch (err) {
        console.error('Error al actualizar perfil:', err);
        res.status(500).json({ message: 'Error al actualizar perfil' });
    }
};
