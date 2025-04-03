const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Usuario = require("./Usuario");

const Administrador = sequelize.define("Administrador", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
});

// Relación con Usuario (1 a 1)
Administrador.belongsTo(Usuario, { foreignKey: "usuarioId", onDelete: "CASCADE" });

module.exports = Administrador;
