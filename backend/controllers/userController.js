const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Fonction pour l'inscription
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Utilisateur enregistré avec succès !" });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error });
  }
};

// Fonction pour la connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    // Réponse en cas de succès
    res.status(200).json({ message: "Connexion réussie !", user });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error });
  }
};

// Exportez les deux fonctions
module.exports = { register, login };