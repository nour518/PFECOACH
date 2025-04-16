// models/Test.js
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: String,
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }]
});

module.exports = mongoose.model('Test', testSchema);