const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const User = require('../models/User');
=======
const User = require('../models/User');  
>>>>>>> 6794824 (Ajout du code)

// Fonction pour créer un objet erreur standardisé
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  return error;
};

<<<<<<< HEAD
// Middleware pour vérifier l'authentification
=======
// ✅ Middleware pour vérifier l'authentification
>>>>>>> 6794824 (Ajout du code)
exports.protect = async (req, res, next) => {
  try {
    let token;

<<<<<<< HEAD
    // Vérifier si le token est présent dans les headers
=======
    // Vérification de la présence du token dans l'en-tête Authorization
>>>>>>> 6794824 (Ajout du code)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
<<<<<<< HEAD
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
=======
      return res.status(401).json({ message: "Non autorisé, token absent" });
    }

    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.id).select('-password');
    if (!currentUser) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    // Vérifier si le mot de passe a été changé après l'émission du token
    if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ message: "Mot de passe modifié récemment, veuillez vous reconnecter" });
    }

    // Ajouter l'utilisateur à la requête et continuer
>>>>>>> 6794824 (Ajout du code)
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "Non autorisé, token invalide", error: error.message });
  }
};

<<<<<<< HEAD
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
=======
// ✅ Middleware pour restreindre l'accès à certains rôles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès interdit, vous n'avez pas la permission" });
>>>>>>> 6794824 (Ajout du code)
    }
    next();
  };
};

<<<<<<< HEAD
// Middleware pour vérifier si l'utilisateur est un admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(createError('Accès réservé aux administrateurs.', 403));
=======
// ✅ Middleware pour vérifier si l'utilisateur est un coach
exports.isCoach = (req, res, next) => {
  if (req.user.role !== 'coach') {
    return res.status(403).json({ message: "Accès réservé aux coaches" });
  }
  next();
};

// ✅ Middleware pour vérifier si l'utilisateur est un administrateur
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Accès réservé aux administrateurs" });
>>>>>>> 6794824 (Ajout du code)
  }
  next();
};
