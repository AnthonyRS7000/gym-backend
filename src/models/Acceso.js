const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Cliente = require("./Cliente");

const Acceso = sequelize.define("Acceso", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

// Relación: Un cliente puede tener varios accesos
Acceso.belongsTo(Cliente, { foreignKey: "clienteId", onDelete: "CASCADE" });

module.exports = Acceso;
