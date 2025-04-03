const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const TipoMembresia = sequelize.define("TipoMembresia", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    duracion_dias: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    horario_restriccion: {
        type: DataTypes.JSON, // Guardamos las restricciones de días y horas
        allowNull: true,
    },
});

module.exports = TipoMembresia;
