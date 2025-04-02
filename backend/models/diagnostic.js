const mongoose = require("mongoose")

<<<<<<< HEAD
const DiagnosticSchema = new mongoose.Schema({
=======
// Définir le schéma du diagnostic
const diagnosticSchema = new mongoose.Schema({
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
<<<<<<< HEAD
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
=======
  responses: {
    type: Object,
    required: true,
  },
  diagnostic: {
    type: String,
    required: true,
  },
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
  date: {
    type: Date,
    default: Date.now,
  },
})

<<<<<<< HEAD
module.exports = mongoose.model("Diagnostic", DiagnosticSchema)
=======
// Créer le modèle
const Diagnostic = mongoose.model("Diagnostic", diagnosticSchema)

module.exports = Diagnostic

>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
