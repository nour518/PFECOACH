<<<<<<< HEAD
const express = require("express");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
=======
const jwt = require("jsonwebtoken");
const User = require("../models/User");
>>>>>>> 6794824 (Ajout du code)

// Fonction pour créer un objet erreur standardisé
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  return error;
};

<<<<<<< HEAD
// ✅ Inscription
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(createError("Tous les champs sont requis", 400));
    }

    if (!validator.isEmail(email)) {
      return next(createError("Veuillez fournir un email valide", 400));
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return next(createError("Cet email est déjà utilisé.", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "user",
    });

    if (!process.env.JWT_SECRET) {
      return next(createError("Erreur interne : clé JWT manquante", 500));
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );

    res.status(201).json({
      status: "success",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Erreur lors de l'inscription :", err);
    next(createError("Une erreur est survenue lors de l'inscription", 500));
  }
});

// ✅ Connexion
router.post("/login", async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log("🔍 Tentative de connexion avec l'email :", email);

    if (!email) {
      return next(createError("Veuillez fournir un email", 400));
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    console.log("🔎 Utilisateur trouvé :", user ? user.email : "Aucun utilisateur trouvé");

    if (!user) {
      console.log("⚠️ Email incorrect pour :", normalizedEmail);
      return next(createError("Email incorrect", 401));
    }

    if (!process.env.JWT_SECRET) {
      return next(createError("Erreur interne : clé JWT manquante", 500));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );

    res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Erreur lors de la connexion :", err);
    next(createError("Une erreur est survenue lors de la connexion", 500));
=======
// ✅ Inscription (Signup)

exports.signup = async (req, res) => {
  try {
    console.log('Données reçues:', req.body);
    
    const { name, email, password } = req.body;

    // Validation basique
    if (!name || !email || !password) {
      console.log('Champs manquants');
      return res.status(400).json({ 
        success: false, 
        message: "Tous les champs sont requis" 
      });
    }

    // Vérification email existant
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email déjà utilisé');
      return res.status(400).json({ 
        success: false, 
        message: "Cet email est déjà utilisé" 
      });
    }

    // Création utilisateur
    console.log('Création nouvel utilisateur');
    const user = await User.create({
      name,
      email,
      password // Stockage direct (non haché pour simplifier)
    });

    console.log('Utilisateur créé avec succès:', user._id);
    
    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('ERREUR COMPLÈTE:', error);
    res.status(500).json({
      success: false,
      message: "Erreur technique lors de l'inscription",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
>>>>>>> 6794824 (Ajout du code)
  }
});

<<<<<<< HEAD
// ✅ Profil utilisateur
router.get("/me", authMiddleware.protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("coach", "name email");
    if (!user) {
      return next(createError("Utilisateur non trouvé", 404));
=======
// ✅ Connexion (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation des entrées
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis"
      });
    }

    // 2. Recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {  // Comparaison directe du mot de passe
      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects"
      });
    }

    // 3. Vérification de la configuration JWT
    if (!process.env.JWT_SECRET) {
      throw new Error("Configuration JWT manquante");
    }

    // 4. Génération du token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // 5. Préparation de la réponse
    const userData = user.toObject();
    delete userData.password; // Supprime le mot de passe avant de l'envoyer

    res.status(200).json({
      success: true,
      token,
      user: userData
    });

  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ Récupération des utilisateurs (Get Users)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password"); // Exclure les mots de passe
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message });
  }
};

// ✅ Récupération du profil utilisateur
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("coach", "name email");
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
>>>>>>> 6794824 (Ajout du code)
    }

    res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
<<<<<<< HEAD
        coach: user.coach,
      },
    });
  } catch (err) {
    console.error("❌ Erreur lors de la récupération du profil :", err);
    next(createError("Une erreur est survenue lors de la récupération du profil", 500));
  }
});

module.exports = router;
=======
        coach: user.coach || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du profil", error: error.message });
  }
};
>>>>>>> 6794824 (Ajout du code)
