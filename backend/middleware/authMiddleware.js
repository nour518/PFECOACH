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