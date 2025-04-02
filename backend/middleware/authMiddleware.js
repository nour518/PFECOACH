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
    }
  }

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
