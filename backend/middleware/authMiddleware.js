const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const app = express();

// Middleware pour protéger les routes
const protect = async (req, res, next) => {
  console.log('Headers reçus:', req.headers);

  const authHeader =
    req.headers.authorization ||
    req.headers.Authorization ||
    req.header('x-auth-token');

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: "Token manquant ou mal formaté"
    });
  }

  const token = authHeader.split(' ')[1]?.trim();

  console.log('Token reçu:', token); // ✅ déplacé ici après l'initialisation

  if (!token || token.split('.').length !== 3) {
    return res.status(401).json({
      success: false,
      message: "Token JWT malformé"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false
    });
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur JWT complète:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Session expirée - Veuillez vous reconnecter",
        error: error.message
      });
    }

    res.status(401).json({ success: false, message: "Token invalide" });
  }
};

// Route pour renouveler le token
app.post('/api/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(403).json({ success: false, message: 'Refresh token manquant' });
  }

  // Vérification du refresh token
  jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Refresh token invalide' });
    }

    // Vérification du rôle de l'utilisateur via l'ID décodé
    const admin = await Admin.findById(decoded.id).lean();
    if (!admin) {
      return res.status(403).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Générer un nouveau access token
    const newAccessToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Réponse avec le nouveau access token
    res.json({ success: true, accessToken: newAccessToken });
  });
});

// Middleware de vérification admin
const checkAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Privilèges insuffisants"
    });
  }
  next();
};

// Middleware avancé de permissions (optionnel)
const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user.permissions || !req.user.permissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: `Permission "${permission}" requise`
        });
      }
      next();
    } catch (error) {
      console.error("Erreur de permission:", error);
      res.status(500).json({
        success: false,
        message: "Erreur de vérification des permissions"
      });
    }
  };
};

module.exports = {
  protect,
  checkAdmin,
  checkPermission
};
