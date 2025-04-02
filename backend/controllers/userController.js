const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validator = require('validator');

// Fonction pour créer un objet erreur standardisé
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  return error;
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation des champs
    if (!name || !email || !password) {
      throw createError('Tous les champs sont requis', 400);
    }

    // Validation de l'email
    if (!validator.isEmail(email)) {
      throw createError('Veuillez fournir un email valide', 400);
    }

    // Vérification de l'existence de l'utilisateur
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError('Email déjà utilisé', 400);
    }

    // Création du nouvel utilisateur
    const newUser = await User.create({
      name,
      email,
      password
    });

    // Génération du token JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    // Réponse réussie
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified
        }
      }
    });

  } catch (err) {
    // Passage à la gestion d'erreur centralisée
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Vérification des champs
    if (!email || !password) {
      throw createError('Veuillez fournir un email et un mot de passe', 400);
    }

    // Recherche de l'utilisateur avec le mot de passe
    const user = await User.findOne({ email }).select('+password');
    
    // Vérification de l'utilisateur et du mot de passe
    if (!user || !(await user.comparePassword(password))) {
      throw createError('Email ou mot de passe incorrect', 401);
    }

    // Génération du token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    // Réponse réussie
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });

  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('coach', 'name email');
    
    if (!user) {
      throw createError('Utilisateur non trouvé', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          coach: user.coach
        }
      }
    });
  } catch (err) {
    next(err);
  }
};