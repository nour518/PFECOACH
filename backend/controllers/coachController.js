// controllers/coachController.js
const Coach = require('../models/Coach');  // Assurez-vous que le chemin est correct

// Ajouter un coach
const addCoach = async (req, res) => {
  try {
    const { name, expertise } = req.body;
    const newCoach = new Coach({ name, expertise });

    const savedCoach = await newCoach.save();
    res.status(201).json(savedCoach);
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un coach:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout d'un coach", error: error.message });
  }
};

// Récupérer tous les coachs
const getAllCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.status(200).json(coaches);
  } catch (error) {
    console.error("Erreur lors de la récupération des coachs:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des coachs", error: error.message });
  }
};

// Récupérer un coach par son ID
const getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return res.status(404).json({ message: "Coach non trouvé" });
    }

    res.status(200).json(coach);
  } catch (error) {
    console.error("Erreur lors de la récupération du coach:", error);
    res.status(500).json({ message: "Erreur lors de la récupération du coach", error: error.message });
  }
};

// Mettre à jour un coach
const updateCoach = async (req, res) => {
  try {
    const { name, expertise } = req.body;
    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      { name, expertise },
      { new: true }  // Renvoie l'objet mis à jour
    );

    if (!coach) {
      return res.status(404).json({ message: "Coach non trouvé" });
    }

    res.status(200).json(coach);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du coach:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du coach", error: error.message });
  }
};

// Supprimer un coach
const deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndDelete(req.params.id);

    if (!coach) {
      return res.status(404).json({ message: "Coach non trouvé" });
    }

    res.status(200).json({ message: "Coach supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du coach:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du coach", error: error.message });
  }
};

module.exports = {
  addCoach,
  getAllCoaches,
  getCoachById,
  updateCoach,
  deleteCoach,
};
