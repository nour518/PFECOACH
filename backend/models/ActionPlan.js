const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["a_faire", "en_cours", "termine"],
    default: "a_faire",
  },
  deadline: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const ActionPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  diagnosticId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Diagnostic",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tasks: [TaskSchema],
  status: {
    type: String,
    enum: ["active", "completed", "archived"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Middleware pour mettre à jour la date de modification
ActionPlanSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model("ActionPlan", ActionPlanSchema)

