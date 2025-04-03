const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando correctamente");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
