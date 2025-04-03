const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Fonction pour créer un objet erreur standardisé
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  return error;
};

// ✅ Inscription (Signup)
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation des champs obligatoires
    if (!name || !email || !password) {
      return next(createError("Tous les champs sont requis", 400));
    }

    // Vérification de la validité de l'email
    if (!validator.isEmail(email)) {
      return next(createError("Veuillez fournir un email valide", 400));
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Vérification si l'email est déjà utilisé
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return next(createError("Cet email est déjà utilisé.", 400));
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "user",
    });

    // Vérification de la clé JWT
    if (!process.env.JWT_SECRET) {
      return next(createError("Erreur interne : clé JWT manquante", 500));
    }

    // Création du token JWT
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );

    // Réponse avec le token et l'utilisateur
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

// ✅ Connexion (Login)
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation des champs
    if (!email || !password) {
      return next(createError("Email et mot de passe sont requis", 400));
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return next(createError("Email incorrect", 401));
    }

    // Comparaison du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createError("Mot de passe incorrect", 401));
    }

    // Vérification de la clé JWT
    if (!process.env.JWT_SECRET) {
      return next(createError("Erreur interne : clé JWT manquante", 500));
    }

    // Création du token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );

    // Réponse avec le token et l'utilisateur
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
  }
});

// ✅ Profil utilisateur
router.get("/me", authMiddleware.protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("coach", "name email");
    if (!user) {
      return next(createError("Utilisateur non trouvé", 404));
    }

    res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coach: user.coach || null,
      },
    });
  } catch (err) {
    console.error("❌ Erreur lors de la récupération du profil :", err);
    next(createError("Une erreur est survenue lors de la récupération du profil", 500));
  }
});

module.exports = router;
