const mongoose = require('mongoose');

// Définir le schéma du diagnostic
const diagnosticSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Référence à un modèle User (si vous en avez un)
    required: true 
  },
  responses: { 
    type: Object, // Stocker les réponses de l'utilisateur sous forme d'objet
    required: true 
  },
  diagnostic: { 
    type: String, // Stocker le diagnostic généré par Gemini
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now // Date de création du diagnostic
  }
});

// Créer le modèle Diagnostic
const Diagnostic = mongoose.model('Diagnostic', diagnosticSchema);

// Exporter le modèle
module.exports = Diagnostic;