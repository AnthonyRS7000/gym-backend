const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Usuario = require("./Usuario");
const TipoMembresia = require("./TipoMembresia");

const Cliente = sequelize.define("Cliente", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    genero: {
        type: DataTypes.ENUM("M", "F", "otro"),
        allowNull: false,
    },
    peso: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    estatura: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario, // ✅ Referencia al nombre de la tabla en BD
            key: "id",
        },
    },
    tipoMembresiaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoMembresia, // ✅ Referencia al nombre de la tabla en BD
            key: "id",
        },
    },
});

// **Definir relaciones aquí**
Cliente.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
Cliente.belongsTo(TipoMembresia, { foreignKey: "tipoMembresiaId", as: "tipoMembresia" });

// **Definir la relación en Usuario después de importar Cliente**
Usuario.hasOne(Cliente, { foreignKey: "usuarioId", as: "cliente" });

module.exports = Cliente;
