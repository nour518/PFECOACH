const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Fonction pour l'inscription
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer un nouvel utilisateur
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Par défaut, le rôle est 'user'
    })

    await newUser.save()

    // Générer un token JWT
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "30d" })

    res.status(201).json({
      message: "Utilisateur enregistré avec succès !",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message })
  }
}

// Fonction pour la connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." })
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" })

    // Réponse en cas de succès
    res.status(200).json({
      message: "Connexion réussie !",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message })
  }
}

// Fonction pour récupérer tous les utilisateurs (pour les coaches)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password")
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message })
  }
}

// Exportez les fonctions
module.exports = { register, login, getAllUsers }

