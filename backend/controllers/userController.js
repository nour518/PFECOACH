<<<<<<< HEAD
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
=======
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validator = require('validator');
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80

// Fonction pour créer un objet erreur standardisé
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  return error;
};

exports.signup = async (req, res, next) => {
  try {
<<<<<<< HEAD
    const { name, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
=======
    const { name, email, password } = req.body;

    // Validation des champs
    if (!name || !email || !password) {
      throw createError('Tous les champs sont requis', 400);
    }

    // Validation de l'email
    if (!validator.isEmail(email)) {
      throw createError('Veuillez fournir un email valide', 400);
    }
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80

    // Vérification de l'existence de l'utilisateur
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError('Email déjà utilisé', 400);
    }

    // Création du nouvel utilisateur
    const newUser = await User.create({
      name,
      email,
<<<<<<< HEAD
      password: hashedPassword,
      role: role || "user", // Par défaut, le rôle est 'user'
    });

    await newUser.save();

    // Générer un token JWT
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "30d" });
=======
      password
    });

    // Génération du token JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80

    // Réponse réussie
    res.status(201).json({
      status: 'success',
      token,
<<<<<<< HEAD
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
=======
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
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

<<<<<<< HEAD
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });
=======
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
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80

    // Réponse réussie
    res.status(200).json({
      status: 'success',
      token,
<<<<<<< HEAD
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
};
=======
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
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80

  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
<<<<<<< HEAD
    const users = await User.find({ role: "user" }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message });
  }
};

module.exports = { register, login, getAllUsers };
=======
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
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
