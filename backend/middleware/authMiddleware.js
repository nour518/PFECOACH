const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Fonction pour créer un objet erreur standardisé
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  return error;
};

// Middleware pour vérifier l'authentification
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Vérification de la présence du token dans l'en-tête Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Vous n'êtes pas connecté. Veuillez vous connecter pour accéder." });
    }

    // Vérification du token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.id).select('-password');
    if (!currentUser) {
      return res.status(401).json({ message: "L'utilisateur associé à ce token n'existe plus." });
    }

    // Vérifier si le mot de passe a été changé après l'émission du token
    if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ message: "Le mot de passe a été modifié récemment. Veuillez vous reconnecter." });
    }

    // Ajouter l'utilisateur à la requête et continuer
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "Non autorisé, token invalide", error: error.message });
  }
};

// Middleware pour vérifier si l'utilisateur est un coach
exports.isCoach = (req, res, next) => {
  if (req.user.role !== 'coach') {
    return res.status(403).json({ message: "Accès réservé aux coaches" });
  }
  next();
};

// Middleware pour restreindre l'accès à certains rôles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès interdit, vous n'avez pas la permission" });
    }
    next();
  };
};

// Middleware pour vérifier si l'utilisateur est un administrateur
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Accès réservé aux administrateurs" });
  }
  next();
};
