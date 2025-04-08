const mongoose = require("mongoose")

const DiagnosticSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
    },
    diagnostic: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    responses: {
      type: Object,
    },
    aiAnalysis: {
      stressLevel: String,
      confidenceLevel: String,
      motivationLevel: String,
      aiDiagnostic: String,
    },
    coachNotes: {
      type: String,
    },
    coachValidation: {
      isValid: Boolean,
      coachNotes: String,
      validationDate: Date,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        userName: String,
        text: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
)

module.exports = mongoose.model("Diagnostic", DiagnosticSchema)
