const mongoose = require("mongoose")

// Définir le schéma du diagnostic
const diagnosticSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  responses: {
    type: Object,
    required: true,
  },
  diagnostic: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

// Créer le modèle
const Diagnostic = mongoose.model("Diagnostic", diagnosticSchema)

module.exports = Diagnostic

