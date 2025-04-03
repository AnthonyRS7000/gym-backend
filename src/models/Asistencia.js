const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Cliente = require("./Cliente");

const Asistencia = sequelize.define("Asistencia", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cliente,
            key: "id",
        },
    },
    fechaHora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Se guarda automáticamente la fecha y hora actual
    },
});

Cliente.hasMany(Asistencia, { foreignKey: "clienteId" });
Asistencia.belongsTo(Cliente, { foreignKey: "clienteId" });

module.exports = Asistencia;
