const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Coach = require("../models/Coach")

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ message: "Non autorisé" })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Vérifier d'abord si c'est un utilisateur
    let user = await User.findById(decoded.id)

    // Si ce n'est pas un utilisateur, vérifier si c'est un coach
    if (!user) {
      user = await Coach.findById(decoded.id)
    }

    if (!user) return res.status(401).json({ message: "Utilisateur introuvable" })

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: "Token invalide ou expiré" })
  }
}

