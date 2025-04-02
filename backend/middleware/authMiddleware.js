<<<<<<< HEAD
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Assurez-vous que le modèle User existe

// Middleware pour vérifier l'authentification
const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur sans le mot de passe
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Non autorisé, token invalide' });
=======
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Fonction pour créer un objet erreur standardisé
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  return error;
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // 1) Vérifier la présence du token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
    }

    if (!token) {
      throw createError(
        "Vous n'êtes pas connecté. Veuillez vous connecter pour accéder.",
        401
      );
    }

    // 2) Vérification du token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // 3) Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw createError(
        "L'utilisateur associé à ce token n'existe plus.",
        401
      );
    }

    // 4) Vérifier si le mot de passe a été changé après l'émission du token
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw createError(
        'Le mot de passe a été modifié récemment. Veuillez vous reconnecter.',
        401
      );
    }

    // Accorder l'accès à la route protégée
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

<<<<<<< HEAD
  if (!token) {
    res.status(401).json({ message: 'Non autorisé, pas de token' });
  }
};

// Middleware pour vérifier si l'utilisateur est un coach
const isCoach = (req, res, next) => {
  if (req.user && req.user.role === 'coach') {
    return next();
  } else {
    return res.status(403).json({ message: 'Accès interdit, vous n\'êtes pas un coach' });
  }
};

module.exports = { protect, isCoach };
=======
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError(
          "Vous n'avez pas la permission d'effectuer cette action.",
          403
        )
      );
    }
    next();
  };
};

exports.isCoach = (req, res, next) => {
  if (req.user.role !== 'coach') {
    return next(
      createError('Accès réservé aux coaches.', 403)
    );
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      createError('Accès réservé aux administrateurs.', 403)
    );
  }
  next();
};
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
