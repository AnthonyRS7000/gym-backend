const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Usuario = require("./Usuario");

const Entrenador = sequelize.define("Entrenador", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    experiencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Años de experiencia",
    },
});

// Relación con Usuario (1 a 1)
Entrenador.belongsTo(Usuario, { foreignKey: "usuarioId", onDelete: "CASCADE" });

module.exports = Entrenador;
