// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const geminiRoutes = require("./routes/geminiRoutes");


console.log("Clé Gemini :", process.env.GEMINI_API_KEY);

const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log(err));

// Routes utilisateur
app.use("/api/users", userRoutes);

// Routes Gemini
app.use("/api/gemini", geminiRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));