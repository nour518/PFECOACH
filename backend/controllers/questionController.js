const Question = require('../models/Question'); // Assurez-vous que le modèle est bien importé

const defaultQuestions = [
  { question: "Qu'est-ce qui vous apporte aujourd'hui ?", type: "text", name: "current_concern" },
  { question: "Où êtes-vous actuellement ?", type: "text", name: "current_location" },
  { question: "Comment décririez-vous votre situation en ce moment ?", type: "text", name: "current_situation" },
  { question: "Qu'est-ce qui fonctionne bien dans votre vie actuellement ?", type: "text", name: "positive_aspects" },
  { question: "Qu'est-ce qui ne fonctionne pas comme vous le souhaitez ?", type: "text", name: "negative_aspects" },
  { question: "Quelles sont les trois choses que vous aimez vraiment dans votre vie ?", type: "text", name: "three_likes" },
  { question: "Que ressentez-vous quand vous pensez à cette situation ?", type: "text", name: "feelings_about_situation" },
  { question: "Qu'est-ce qui vous manque aujourd'hui pour vous sentir épanoui ?", type: "text", name: "missing_elements" },
  { question: "Sur quoi vous basez-vous pour dire cela ?", type: "text", name: "basis_for_assessment" },
  { question: "Quelle est votre plus grande préoccupation actuellement ?", type: "text", name: "biggest_concern" },
];

exports.initializeQuestions = async (req, res) => {
  try {
    // Optionnel: supprimer les questions existantes
    await Question.deleteMany({});

    // Insérer les nouvelles questions sans le champ `id`
    const questions = await Question.insertMany(defaultQuestions);

    res.status(201).json({
      success: true,
      message: "Questions initialisées avec succès",
      data: questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'initialisation des questions",
      error: error.message
    });
  }
};
exports.getQuestions = async (req, res) => {
    try {
      const questions = await Question.find(); // Récupère toutes les questions dans la base de données
      res.status(200).json({
        success: true,
        data: questions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des questions",
        error: error.message,
      });
    }
  };