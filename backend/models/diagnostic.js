const mongoose = require("mongoose");

const DiagnosticSchema = new mongoose.Schema({
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
module.exports = mongoose.model("Diagnostic", DiagnosticSchema);
