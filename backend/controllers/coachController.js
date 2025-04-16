const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Coach = require("../models/Coach")

// Fonction pour ajouter un coach
const addCoach = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Création du coach avec les données reçues
    const newCoach = new Coach({
      name,
      email,
      password: hashedPassword,
      role: role || "coach", // Par défaut, 'coach' si aucun rôle spécifié
    })

    // Sauvegarde dans la base de données
    await newCoach.save()
    res.status(201).json({ message: "Coach ajouté avec succès", coach: newCoach })
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de l'ajout du coach", error: error.message })
  }
}

// Fonction de connexion pour les coachs
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Vérifier si le coach existe
    const coach = await Coach.findOne({ email })
    if (!coach) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, coach.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    // Créer et signer le token JWT
    const token = jwt.sign({ id: coach._id, role: coach.role }, process.env.JWT_SECRET, { expiresIn: "1d" })

    // Retourner le token et les infos du coach (sans le mot de passe)
    const coachData = {
      _id: coach._id,
      name: coach.name,
      email: coach.email,
      role: coach.role,
    }

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: coachData,
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message })
  }
}

// Fonction pour récupérer tous les coachs
const getAllCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find().select("-password")
    res.status(200).json(coaches)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des coachs", error: error.message })
  }
}

// Fonction pour récupérer un coach par son ID
const getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id).select("-password")
    if (!coach) {
      return res.status(404).json({ message: "Coach non trouvé" })
    }
    res.status(200).json(coach)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du coach", error: error.message })
  }
}

// Fonction pour mettre à jour un coach
const updateCoach = async (req, res) => {
  try {
    // Si le mot de passe est fourni, le hacher
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }

    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!coach) {
      return res.status(404).json({ message: "Coach non trouvé" })
    }

    res.status(200).json({ message: "Coach mis à jour avec succès", coach })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du coach", error: error.message })
  }
}

// Fonction pour supprimer un coach
const deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndDelete(req.params.id)
    if (!coach) {
      return res.status(404).json({ message: "Coach non trouvé" })
    }
    res.status(200).json({ message: "Coach supprimé avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du coach", error: error.message })
  }
}

// Création d'un coach spécifique (sadek21@gmail.com)
const createSpecificCoach = async (req, res) => {
  try {
    // Vérifier si le coach existe déjà
    const existingCoach = await Coach.findOne({ email: "sadek21@gmail.com" })
    if (existingCoach) {
      return res.status(400).json({ message: "Ce coach existe déjà" })
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash("123456", 10)

    // Création du coach spécifique
    const specificCoach = new Coach({
      name: "Sadek",
      email: "sadek21@gmail.com",
      password: hashedPassword,
      role: "coach",
    })

    // Sauvegarde dans la base de données
    await specificCoach.save()
    res.status(201).json({ message: "Coach spécifique créé avec succès", coach: specificCoach })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du coach spécifique", error: error.message })
  }
}

module.exports = {
  addCoach,
  login,
  getAllCoaches,
  getCoachById,
  updateCoach,
  deleteCoach,
  createSpecificCoach,
}