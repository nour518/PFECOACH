const User = require("../models/User")
const Coach = require("../models/Coach")
const Diagnostic = require("../models/Diagnostic")
const ActionPlan = require("../models/ActionPlan")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const validator = require("validator")

// @desc    Inscrire un utilisateur
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé",
      })
    }

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password,
      role: "user",
    })

    // Générer le token
    const token = user.getSignedJwtToken()

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
      error: error.message,
    })
  }
}

// @desc    Connecter un utilisateur
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Valider email et mot de passe
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un email et un mot de passe",
      })
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides",
      })
    }

    // Vérifier si le mot de passe correspond
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides",
      })
    }

    // Mettre à jour la date de dernière connexion
    user.lastLogin = Date.now()
    await user.save()

    // Générer le token
    const token = user.getSignedJwtToken()

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message,
    })
  }
}

// @desc    Obtenir le profil de l'utilisateur actuel
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("coach", "name email")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      })
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionDate: user.subscriptionDate,
        subscriptionStatus: user.subscriptionStatus,
        testResponses: user.testResponses,
        diagnostic: user.diagnostic,
        planAction: user.planAction,
        coach: user.coach,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
      error: error.message,
    })
  }
}

// @desc    Mettre à jour le profil de l'utilisateur
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      })
    }

    // Mettre à jour les champs
    if (name) user.name = name
    if (email) user.email = email
    if (password) user.password = password

    await user.save()

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du profil",
      error: error.message,
    })
  }
}

// @desc    Soumettre les réponses d'un test
// @route   POST /api/users/test-response
// @access  Private
exports.submitTestResponse = async (req, res) => {
  try {
    const { testId, responses } = req.body

    if (!testId || !responses) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir l'ID du test et les réponses",
      })
    }

    // Simuler une analyse IA
    const aiAnalysis = {
      stressLevel: Math.random() > 0.5 ? "élevé" : "faible",
      confidenceLevel: Math.random() > 0.5 ? "élevé" : "faible",
      motivationLevel: Math.random() > 0.5 ? "élevé" : "faible",
      aiDiagnostic: "Analyse automatique basée sur les réponses fournies.",
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      })
    }

    // Ajouter la réponse au test
    user.testResponses.push({
      testId,
      date: new Date(),
      responses,
      aiAnalysis,
      coachValidation: null,
    })

    await user.save()

    res.status(201).json({
      success: true,
      message: "Réponses au test soumises avec succès",
      testResponse: user.testResponses[user.testResponses.length - 1],
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la soumission des réponses",
      error: error.message,
    })
  }
}

// @desc    Obtenir toutes les réponses aux tests de l'utilisateur
// @route   GET /api/users/test-responses
// @access  Private
exports.getUserTestResponses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      })
    }

    res.status(200).json({
      success: true,
      testResponses: user.testResponses,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des réponses",
      error: error.message,
    })
  }
}

// @desc    Assigner un coach à un utilisateur
// @route   POST /api/users/assign-coach
// @access  Private (Admin ou Coach)
exports.assignCoach = async (req, res) => {
  try {
    const { userId, coachId } = req.body

    // Vérifier si l'utilisateur est un admin ou un coach
    if (req.user.role !== "admin" && req.user.role !== "coach") {
      return res.status(403).json({
        success: false,
        message: "Non autorisé à assigner un coach",
      })
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      })
    }

    // Vérifier si le coach existe
    const coach = await Coach.findById(coachId)
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: "Coach non trouvé",
      })
    }

    // Assigner le coach à l'utilisateur
    user.coach = coachId
    await user.save()

    res.status(200).json({
      success: true,
      message: "Coach assigné avec succès",
      data: {
        userId: user._id,
        coachId: coach._id,
        coachName: coach.name,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'assignation du coach",
      error: error.message,
    })
  }
}

// @desc    Obtenir le tableau de bord d'un utilisateur
// @route   GET /api/users/dashboard
// @access  Private
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id

    // Vérifier si l'utilisateur a le droit d'accéder à ce tableau de bord
    if (req.user.role !== "coach" && req.user.role !== "admin" && req.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé à accéder à ce tableau de bord",
      })
    }

    // Récupérer l'utilisateur avec son coach
    const user = await User.findById(userId).populate("coach", "name email")
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      })
    }

    // Récupérer les diagnostics de l'utilisateur
    const diagnostics = await Diagnostic.find({ userId }).sort({ date: -1 }).limit(5)

    // Récupérer les plans d'action de l'utilisateur
    const actionPlans = await ActionPlan.find({ userId }).sort({ createdDate: -1 }).limit(5)

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          coach: user.coach,
          diagnostic: user.diagnostic,
          planAction: user.planAction,
        },
        diagnostics,
        actionPlans,
        stats: {
          totalDiagnostics: await Diagnostic.countDocuments({ userId }),
          totalActionPlans: await ActionPlan.countDocuments({ userId }),
          completedActionPlans: await ActionPlan.countDocuments({ userId, status: "completed" }),
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du tableau de bord",
      error: error.message,
    })
  }
}
