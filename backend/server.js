const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const coachRoutes = require("./routes/coachRoutes");

dotenv.config();

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/coaches", coachRoutes);

// Gestion des erreurs non prises en charge
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.statusCode || 500)
    .json({ status: err.status || "error", message: err.message });
});

// Connexion à MongoDB puis démarrage du serveur
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connecté à MongoDB");
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
  })
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));
