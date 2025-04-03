require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { createServer } = require("http");
<<<<<<< HEAD
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Importer Gemini AI
const userRoutes = require("./routes/userRoutes");
const authMiddleware = require("./middleware/authMiddleware");

// Vérifications des variables d'environnement
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Erreur : Clé API GEMINI_API_KEY manquante !");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("❌ Erreur : MONGODB_URI manquante !");
=======
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Vérification des variables d'environnement obligatoires
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Erreur : GEMINI_API_KEY manquante dans .env !");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("❌ Erreur : MONGODB_URI manquante dans .env !");
>>>>>>> 6794824 (Ajout du code)
  process.exit(1);
}

// Initialisation de l'application Express
const app = express();
const httpServer = createServer(app);

<<<<<<< HEAD
// Middleware CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

=======
// Middleware CORS (configuration pour le frontend)
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
>>>>>>> 6794824 (Ajout du code)
app.use(express.json());

// Connexion à MongoDB
mongoose
<<<<<<< HEAD
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connecté à MongoDB"))
=======
  .connect(process.env.MONGODB_URI)
.then(() => console.log("✅ Connecté à MongoDB"))
>>>>>>> 6794824 (Ajout du code)
  .catch((err) => {
    console.error("❌ Erreur MongoDB :", err);
    process.exit(1);
  });

// Initialisation de Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

<<<<<<< HEAD
=======
// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/diagnostics", require("./middleware/authMiddleware").protect, require("./routes/diagnosticRoutes"));
app.use("/api/messages", require("./middleware/authMiddleware").protect, require("./routes/messageRoutes"));
app.use("/api/plan-actions", require("./middleware/authMiddleware").protect, require("./routes/planActionRoutes"));

>>>>>>> 6794824 (Ajout du code)
// Route pour générer un diagnostic avec Gemini AI
app.post("/api/gemini/diagnostic", async (req, res) => {
  const { responses } = req.body;

  if (!responses) {
    return res.status(400).json({ success: false, message: "Réponses manquantes." });
  }

  const prompt = `
    Vous êtes un coach de vie professionnel. Voici les réponses d'un utilisateur à un test d'évaluation. 
    Analysez-les et fournissez un diagnostic personnalisé avec des conseils adaptés :

    Réponses de l'utilisateur :
    ${Object.entries(responses).map(([key, value]) => `- ${key} : ${value || "non renseigné"}`).join("\n")}

    Diagnostic et recommandations :
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
<<<<<<< HEAD
    const diagnostic = result.response.text(); // Correction ici
=======
    const diagnostic = result.response.text();
>>>>>>> 6794824 (Ajout du code)

    res.json({ success: true, diagnostic });
  } catch (error) {
    console.error("❌ Erreur avec Gemini :", error);
    res.status(500).json({ success: false, message: "Erreur lors de l'analyse avec Gemini." });
  }
});

<<<<<<< HEAD
// Routes API
app.use("/api/users", userRoutes);
app.use("/api/diagnostics", authMiddleware.protect, require("./routes/diagnosticRoutes"));
app.use("/api/messages", authMiddleware.protect, require("./routes/messageRoutes"));
app.use("/api/plan-actions", authMiddleware.protect, require("./routes/planActionRoutes"));
=======
// Route pour afficher la liste des modèles disponibles sur Gemini AI
app.get("/api/gemini/models", async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json(models);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des modèles :", error);
    res.status(500).json({ error: "Impossible d'obtenir la liste des modèles." });
  }
});
>>>>>>> 6794824 (Ajout du code)

// Route de test
app.get("/api/health-check", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API fonctionnelle",
    database: mongoose.connection.readyState === 1 ? "connecté" : "déconnecté",
  });
});

<<<<<<< HEAD
// Gestion centralisée des erreurs
=======
// Gestion des erreurs globales
>>>>>>> 6794824 (Ajout du code)
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

<<<<<<< HEAD
  console.error("Erreur :", err.stack);
=======
  console.error("❌ Erreur :", err.stack);
>>>>>>> 6794824 (Ajout du code)

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 5002;
httpServer.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`);
});
=======
  console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
>>>>>>> 6794824 (Ajout du code)
