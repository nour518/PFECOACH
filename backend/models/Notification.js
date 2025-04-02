const mongoose = require("mongoose")

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["diagnostic_approved", "diagnostic_modified", "task_assigned", "task_completed", "message", "system"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedTo: {
    model: {
      type: String,
      enum: ["Diagnostic", "ActionPlan", "Task"],
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Notification", NotificationSchema)

