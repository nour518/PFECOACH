const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Une description est requise"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  },
})

const planActionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tasks: [taskSchema],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

const PlanAction = mongoose.model("PlanAction", planActionSchema)

module.exports = PlanAction

