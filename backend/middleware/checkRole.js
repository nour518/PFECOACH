// middleware/checkRole.js

const checkRole = (role) => {
    return (req, res, next) => {
      if (req.user && req.user.role === role) {
        return next();
      } else {
        return res.status(403).json({ message: 'Accès refusé, rôle insuffisant' });
      }
    };
  };
  
  module.exports = checkRole;
  