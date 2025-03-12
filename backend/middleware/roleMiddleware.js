// Middleware pour vérifier si l'utilisateur est un coach
const isCoach = (req, res, next) => {
    if (req.user && req.user.role === "coach") {
      next()
    } else {
      res.status(403).json({ message: "Accès refusé. Vous devez être un coach pour accéder à cette ressource." })
    }
  }
  
  module.exports = { isCoach }
  
  