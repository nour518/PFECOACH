const mongoose = require('mongoose');

const coachSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['coach', 'admin'], default: 'coach' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coach', coachSchema);
