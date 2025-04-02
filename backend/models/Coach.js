// models/Coach.js
const mongoose = require('mongoose');

const coachSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    expertise: { type: String, required: true },
  },
  { timestamps: true }
);

const Coach = mongoose.model('Coach', coachSchema);

module.exports = Coach;
