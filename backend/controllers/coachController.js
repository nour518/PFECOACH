const Coach = require('../models/Coach');

// Ajouter un coach
const addCoach = async (req, res) => {
  try {
    const newCoach = new Coach(req.body);
    await newCoach.save();
    res.status(201).json(newCoach);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l\'ajout du coach' });
  }
};

// Récupérer tous les coachs
const getAllCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.json(coaches);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération des coachs' });
  }
};

// Récupérer un coach par son ID
const getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({ message: 'Coach non trouvé' });
    }
    res.json(coach);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération du coach' });
  }
};

// Mise à jour d'un coach
const updateCoach = async (req, res) => {
  try {
    const updatedCoach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCoach) {
      return res.status(404).json({ message: 'Coach non trouvé' });
    }
    res.json(updatedCoach);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du coach' });
  }
};

// Suppression d'un coach
const deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndDelete(req.params.id);
    if (!coach) {
      return res.status(404).json({ message: 'Coach non trouvé' });
    }
    res.status(204).json({ message: 'Coach supprimé' });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression du coach' });
  }
};

module.exports = {
  addCoach,
  getAllCoaches,
  getCoachById,
  updateCoach,
  deleteCoach,
};
