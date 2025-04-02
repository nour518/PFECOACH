const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Importer Gemini AI
const userRoutes = require("./routes/userRoutes"); // Assurez-vous que le chemin est correct

// Configuration de l'environnement
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Vérification de la clé API
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Erreur : Clé API GEMINI_API_KEY manquante dans le fichier .env !");
  process.exit(1); // Arrête le serveur si la clé API est manquante
}

// Vérification de la variable d'environnement MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error("❌ Erreur : MONGODB_URI manquante dans le fichier .env !");
  process.exit(1); // Arrête le serveur si l'URI MongoDB est manquante
}

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB :", err);
    process.exit(1); // Arrête le serveur si la connexion échoue
  });

// Initialisation de Gemini AI avec la clé API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Route pour traiter le test et générer un diagnostic
app.post("/api/gemini/diagnostic", async (req, res) => {
  const { userId, responses } = req.body;

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
    // Vérifie si le modèle est bien supporté
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    
    // Récupération correcte du texte généré
    const diagnostic = result.response.text();

    res.json({ success: true, diagnostic });
  } catch (error) {
    console.error("Erreur avec Gemini :", error);
    res.status(500).json({ success: false, message: "Erreur lors de l'analyse avec Gemini." });
  }
});

// Route pour afficher la liste des modèles disponibles
app.get("/api/gemini/models", async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json(models);
  } catch (error) {
    console.error("Erreur lors de la récupération des modèles :", error);
    res.status(500).json({ error: "Impossible d'obtenir la liste des modèles." });
  }
});

// Utilisation des routes utilisateurs
app.use("/api/users", userRoutes); // Ajout de la route d'inscription et de connexion

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
