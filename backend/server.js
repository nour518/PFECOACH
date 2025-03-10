require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const geminiRoutes = require("./routes/geminiRoutes");

console.log("Clé Gemini chargée ?", process.env.GEMINI_API_KEY ? "OUI" : "NON");
console.log("Clé Gemini :", process.env.GEMINI_API_KEY);
console.log("MONGO_URI :", process.env.MONGO_URI);

const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connecté avec succès');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur de connexion MongoDB :', err);
});

// Routes utilisateur
app.use("/api/users", userRoutes);

// Routes Gemini
app.use("/api/gemini", geminiRoutes);

// Middleware pour les erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware pour les erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur :', err);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

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