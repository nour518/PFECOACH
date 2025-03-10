require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
console.log("Clé OpenAI/Gemini chargée ?", process.env.GEMINI_API_KEY ? "OUI" : "NON");

const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// Routes utilisateur
app.use("/api/users", userRoutes);

// Routes Gemini
app.use("/api/gemini", geminiRoutes);

const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));

// Gérer les erreurs non capturées
process.on("uncaughtException", (err) => {
  console.error("❌ Erreur non capturée :", err);
});

// Fermer proprement MongoDB lors de l'arrêt du serveur
process.on("SIGINT", async () => {
  console.log("🛑 Fermeture du serveur...");
  await mongoose.connection.close();
  console.log("🔌 Déconnexion de MongoDB");
  process.exit(0);
});
