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

    // Vérifier si le token est présent dans les headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw createError("Vous n'êtes pas connecté. Veuillez vous connecter pour accéder.", 401);
    }

    // Vérification du token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw createError("L'utilisateur associé à ce token n'existe plus.", 401);
    }

    // Vérifier si le mot de passe a été changé après l'émission du token
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw createError('Le mot de passe a été modifié récemment. Veuillez vous reconnecter.', 401);
    }

    // Ajouter l'utilisateur à la requête
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware pour vérifier si l'utilisateur est un coach
exports.isCoach = (req, res, next) => {
  if (req.user && req.user.role === 'coach') {
    return next();
  } else {
    return res.status(403).json({ message: "Accès interdit, vous n'êtes pas un coach" });
  }
};

// Middleware pour restreindre l'accès à certains rôles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(createError("Vous n'avez pas la permission d'effectuer cette action.", 403));
    }
    next();
  };
};

// Middleware pour vérifier si l'utilisateur est un admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(createError('Accès réservé aux administrateurs.', 403));
  }
  next();
};
