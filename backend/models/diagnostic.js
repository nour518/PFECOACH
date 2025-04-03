const mongoose = require("mongoose");

<<<<<<< HEAD
const DiagnosticSchema = new mongoose.Schema({
=======
// Définir le schéma du diagnostic
const diagnosticSchema = new mongoose.Schema({
>>>>>>> 6794824 (Ajout du code)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  diagnostic: {
    type: String,
    required: true,
  },
  responses: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "modified"],
    default: "pending",
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: {
    type: String,
  },
  originalDiagnostic: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Créer et exporter le modèle
<<<<<<< HEAD
module.exports = mongoose.model("Diagnostic", DiagnosticSchema);
=======
module.exports = mongoose.model("Diagnostic", diagnosticSchema);
>>>>>>> 6794824 (Ajout du code)
