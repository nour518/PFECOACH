const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Une description est requise'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: Date.now
  }
});

const planActionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tasks: [taskSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Solution clé : Vérifier si le modèle existe déjà avant de le créer
const PlanAction = mongoose.models.PlanAction || mongoose.model('PlanAction', planActionSchema);

module.exports = PlanAction;