// Middleware pour vérifier si l'utilisateur est un coach

const isCoach = (req, res, next) => {
  if (req.user && req.user.role === "coach") {
    next()
  } else {
    res.status(403).json({ message: "Accès refusé. Vous devez être un coach pour accéder à cette ressource." })
  }
}

// Middleware pour vérifier si l'utilisateur est un administrateur
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Accès refusé. Vous devez être un administrateur pour accéder à cette ressource." })
  }
}

module.exports = { isCoach, isAdmin }


exports.isCoach = (req, res, next) => {
  // L'utilisateur devrait être attaché à la requête par le middleware protect
  if (!req.user || req.user.role !== "coach") {
    return res.status(403).json({ message: "Accès refusé. Réservé aux coaches" })
  }
  next()
}

// Middleware pour vérifier si l'utilisateur est un admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé. Réservé aux administrateurs" })
  }
  next()
}

// Middleware pour vérifier les rôles multiples
exports.hasRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé. Rôle non autorisé" })
    }
    next()
  }
}