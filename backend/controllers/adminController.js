const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Admin = require("../models/admin");
const User = require("../models/User");
const Question = require('../models/Question');

// Vérifie si un ID MongoDB est valide
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Constantes pour une meilleure maintenabilité
const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

const QUESTION_TYPES = ['text', 'multiple-choice', 'number'];
const QUESTION_CATEGORIES = ['Clarification de la Situation', 'Évaluation de l\'avancement', 'Autre'];

// Fonctions utilitaires
const hashPassword = async (password) => await bcrypt.hash(password, 10);
const comparePasswords = async (inputPassword, hashedPassword) => await bcrypt.compare(inputPassword, hashedPassword);

// Contrôleurs


/**
 * Connexion d'un administrateur
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification de l'existence de l'admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: "Identifiants invalides" 
      });
    }

    // Vérification du mot de passe
    const isMatch = await comparePasswords(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Identifiants invalides" 
      });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // Préparation de la réponse
    const adminData = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };

    res.status(200).json({ 
      success: true,
      message: "Connexion réussie",
      token,
      user: adminData
    });

  } catch (error) {
    console.error("Erreur dans login:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message 
    });
  }
};



/**
 * Crée un administrateur spécifique (pour le développement)
 */
const createSpecificAdmin = async (req, res) => {
  try {
    const email = "hanen21@gmail.com";
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(200).json({ 
        success: true,
        message: "L'administrateur spécifique existe déjà",
        data: existingAdmin 
      });
    }

    const specificAdmin = new Admin({
      name: "Hanen",
      email,
      password: await hashPassword("123456"),
      role: ROLES.ADMIN
    });

    await specificAdmin.save();

    const adminResponse = specificAdmin.toObject();
    delete adminResponse.password;

    res.status(201).json({ 
      success: true,
      message: "Administrateur spécifique créé avec succès",
      data: adminResponse 
    });

  } catch (error) {
    console.error("Erreur dans createSpecificAdmin:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la création de l'administrateur spécifique",
      error: error.message 
    });
  }
};

/**
 * Récupère tous les utilisateurs
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email createdAt updatedAt role")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true,
      count: users.length,
      data: users 
    });

  } catch (error) {
    console.error("Erreur dans getAllUsers:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la récupération des utilisateurs",
      error: error.message 
    });
  }
};

/**
 * Supprime un utilisateur
 */
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: "ID utilisateur invalide" 
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Utilisateur non trouvé" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Utilisateur supprimé avec succès",
      deletedUserId: id 
    });

  } catch (error) {
    console.error("Erreur dans deleteUserById:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la suppression de l'utilisateur",
      error: error.message 
    });
  }
};

/**
 * Récupère toutes les questions
 */
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
/**
 * Ajoute une nouvelle question
 */
const addQuestion = async (req, res) => {
  try {
    const { question, type, name, category, options, correctAnswer } = req.body;

    // Validation de base avec trim()
    if (!question?.trim() || !type || !name?.trim() || !category?.trim()) {
      return res.status(400).json({ 
        success: false,
        message: "Tous les champs obligatoires sont requis" 
      });
    }

    // Validation spécifique au type
    if (type === 'multiple') {
      if (!options || !options.length) {
        return res.status(400).json({
          success: false,
          message: "Les questions à choix multiples nécessitent des options"
        });
      }
      // Nettoie les options (supprime les espaces et éléments vides)
      const cleanedOptions = options.map(opt => opt.trim()).filter(opt => opt);
      if (cleanedOptions.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Les questions à choix multiples nécessitent au moins deux options valides"
        });
      }
    }

    if ((type === 'multiple' || type === 'boolean') && !correctAnswer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Une réponse correcte est requise pour ce type de question"
      });
    }

    const newQuestion = new Question({
      question: question.trim(),
      type,
      name: name.trim(),
      category: category.trim(), // Accepte maintenant n'importe quelle catégorie
      ...(type === 'multiple' && { 
        options: options.map(opt => opt.trim()).filter(opt => opt),
        correctAnswer: correctAnswer.trim() 
      }),
      ...(type === 'boolean' && { 
        correctAnswer: correctAnswer.trim()
      })
    });

    await newQuestion.save();

    res.status(201).json({ 
      success: true,
      message: "Question ajoutée avec succès",
      data: newQuestion 
    });

  } catch (error) {
    console.error("Erreur dans addQuestion:", error);
    
    // Gestion spécifique des erreurs MongoDB
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) { // Erreur de duplication
      return res.status(400).json({
        success: false,
        message: "Cette question existe déjà"
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Erreur serveur",
      error: error.message 
    });
  }
};
/**
 * Met à jour une question
 */
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validation des données
    if (!updates.question || !updates.type || !updates.category) {
      return res.status(400).json({
        success: false,
        message: "Question, type et catégorie sont obligatoires"
      });
    }

    // Vérification de l'existence de la question
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question non trouvée"
      });
    }

    // Mise à jour
    const updatedQuestion = await Question.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: "Question mise à jour avec succès",
      data: updatedQuestion
    });

  } catch (error) {
    console.error("Erreur de mise à jour:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};

/**
 * Supprime une question
 */
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: "ID de question invalide" 
      });
    }

    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).json({ 
        success: false,
        message: "Question non trouvée" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Question supprimée avec succès" 
    });

  } catch (error) {
    console.error("Erreur dans deleteQuestion:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la suppression de la question",
      error: error.message 
    });
  }
};
module.exports = {

  login,
  createSpecificAdmin,
  getAllUsers,
  deleteUserById,
  getAllQuestions,
  addQuestion,
  deleteQuestion,
  updateQuestion,
};