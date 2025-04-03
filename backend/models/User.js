const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom est requis"],
    trim: true,
    maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
    validate: {
      validator: function (v) {
        return /^[a-zA-ZÀ-ÿ\s\-']+$/.test(v);
      },
      message: "Le nom ne doit contenir que des lettres et espaces",
    },
  },
  email: {
    type: String,
    required: [true, "Email est requis"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: "Veuillez fournir un email valide",
    },
    index: true,
  },
  password: {
    type: String,
    required: [true, "Mot de passe requis"],
    minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "coach", "admin"],
    default: "user",
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
}, { timestamps: true });

// Middleware pour hacher le mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Méthode pour générer un token JWT
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

module.exports = mongoose.model("User", userSchema);
