const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Cliente = require("./Cliente");
const TipoMembresia = require("./TipoMembresia");

const Membresia = sequelize.define("Membresia", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM("activa", "expirada", "suspendida"),
        defaultValue: "activa",
    },
});

// Relaciones
Membresia.belongsTo(Cliente, { foreignKey: "clienteId", onDelete: "CASCADE" });
Membresia.belongsTo(TipoMembresia, { foreignKey: "tipoMembresiaId", onDelete: "CASCADE" });

module.exports = Membresia;
