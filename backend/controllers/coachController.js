const User = require("../models/User");

// Récupère la liste des abonnés associés à un coach
const getCoachAbonnees = async (req, res) => {
  try {
    const coachId = req.params.coachId;
    // Récupère les utilisateurs dont le champ 'coach' correspond à l'ID du coach
    const abonnees = await User.find({ coach: coachId }).select(
      "name email diagnostic planAction createdAt"
    );
    res.status(200).json({
      status: "success",
      abonnees,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des abonnés",
      error: err.message,
    });
  }
};

module.exports = { getCoachAbonnees };
