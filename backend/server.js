require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs") // Ajout de bcrypt pour le hachage des mots de passe
const { createServer } = require("http")
const { GoogleGenerativeAI } = require("@google/generative-ai")
const userRoutes = require("./routes/userRoutes")
const authMiddleware = require("./middleware/authMiddleware")
const coachRoutes = require("./routes/coachRoutes")
const Coach = require("./models/Coach") // Ajout du modèle Coach

// Vérifications des variables d'environnement
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Erreur : Clé API GEMINI_API_KEY manquante !")
  process.exit(1)
}
if (!process.env.MONGODB_URI) {
  console.error("❌ Erreur : MONGODB_URI manquante !")
  process.exit(1)
}
if (!process.env.JWT_SECRET) {
  console.error("❌ Erreur : JWT_SECRET manquante !")
  process.exit(1)
}

// Initialisation de l'application Express
const app = express()
const httpServer = createServer(app)

// Middleware CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

app.use(express.json())

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => {
    console.error("❌ Erreur MongoDB :", err)
    process.exit(1)
  })

// Initialisation de Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Route pour créer le coach spécifique (sadek21@gmail.com)
app.post("/api/create-specific-coach", async (req, res) => {
  try {
    // Vérifier si le coach existe déjà
    const existingCoach = await Coach.findOne({ email: "sadek21@gmail.com" })
    if (existingCoach) {
      return res.status(200).json({
        message: "Ce coach existe déjà",
        coach: {
          _id: existingCoach._id,
          name: existingCoach.name,
          email: existingCoach.email,
          role: existingCoach.role,
        },
      })
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash("123456", 10)

    // Création du coach spécifique
    const specificCoach = new Coach({
      name: "Sadek",
      email: "sadek21@gmail.com",
      password: hashedPassword,
      role: "coach",
    })

    // Sauvegarde dans la base de données
    await specificCoach.save()

    res.status(201).json({
      message: "Coach spécifique créé avec succès",
      coach: {
        _id: specificCoach._id,
        name: specificCoach.name,
        email: specificCoach.email,
        role: specificCoach.role,
      },
    })
  } catch (error) {
    console.error("❌ Erreur lors de la création du coach spécifique:", error)
    res.status(500).json({ message: "Erreur lors de la création du coach spécifique", error: error.message })
  }
})

// Routes
app.use("/api/users", userRoutes)
app.use("/api/diagnostics", authMiddleware.protect, require("./routes/diagnosticRoutes"))
app.use("/api/messages", authMiddleware.protect, require("./routes/messageRoutes"))
app.use("/api/plan-actions", authMiddleware.protect, require("./routes/planActionRoutes"))
app.use("/api/coaches", coachRoutes)

// Route pour générer un diagnostic avec Gemini AI
app.post("/api/gemini/diagnostic", async (req, res) => {
  const { responses } = req.body

  if (!responses) {
    return res.status(400).json({ success: false, message: "Réponses manquantes." })
  }

  const prompt = `
    Vous êtes un coach de vie professionnel. Voici les réponses d'un utilisateur à un test d'évaluation. 
    Analysez-les et fournissez un diagnostic personnalisé avec des conseils adaptés :

    Réponses de l'utilisateur :
    ${Object.entries(responses)
      .map(([key, value]) => `- ${key} : ${value || "non renseigné"}`)
      .join("\n")}

    Diagnostic et recommandations :
  `

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
    const result = await model.generateContent(prompt)
    const diagnostic = result.response.text()

    res.json({ success: true, diagnostic })
  } catch (error) {
    console.error("❌ Erreur avec Gemini :", error)
    res.status(500).json({ success: false, message: "Erreur lors de l'analyse avec Gemini." })
  }
})

// Route pour afficher la liste des modèles disponibles sur Gemini AI
app.get("/api/gemini/models", async (req, res) => {
  try {
    const models = await genAI.listModels()
    res.json(models)
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des modèles :", error)
    res.status(500).json({ error: "Impossible d'obtenir la liste des modèles." })
  }
})

// Route de test
app.get("/api/health-check", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API fonctionnelle",
    database: mongoose.connection.readyState === 1 ? "connecté" : "déconnecté",
  })
})

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || "error"

  console.error("❌ Erreur :", err.stack)

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

// Lancement du serveur
const PORT = process.env.PORT || 5002
httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`)
})

