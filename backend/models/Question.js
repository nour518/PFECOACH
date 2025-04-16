const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    unique: true // Empêche les doublons exacts
  },
  type: {
    type: String,
    enum: ['text', 'multiple', 'boolean'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true},

  options: {
    type: [String],
    required: function() { return this.type === 'multiple'; }
  },
  correctAnswer: {
    type: String,
    required: function() {
      return this.type === 'multiple' || this.type === 'boolean';
    }
  }
}, { 
  timestamps: true 
});
module.exports = mongoose.model('Question', questionSchema);
