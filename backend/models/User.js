const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Veuillez fournir un email valide"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "coach", "admin"],
      default: "user",
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
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    diagnostic: {
      type: String,
      default: "Aucun diagnostic encore.",
    },
    planAction: {
      type: String,
      default: "Aucun plan encore défini.",
    },
    testResponses: {
      type: [String],
      default: []
    },
 
    
    subscriptionStatus: {
      type: String,
      default: "active",
    },
    subscriptionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = mongoose.model("User", userSchema);