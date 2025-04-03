const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log, // 🔍 Activa logs de SQL
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conectado a MySQL");
    } catch (error) {
        console.error("❌ Error al conectar a MySQL:", error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
