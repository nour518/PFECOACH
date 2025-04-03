const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema(
  {
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
      validate: [validator.isEmail, "Veuillez fournir un email valide"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Mot de passe requis"],
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
      select: false,
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
        },
        message:
          "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
      },
    },
    role: {
      type: String,
      enum: ["user", "coach", "admin"],
      default: "user",
      required: true,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: async function (v) {
          if (!v) return true;
          const coach = await mongoose.model("User").findById(v);
          return coach && coach.role === "coach";
        },
        message: "Le coach référencé doit exister et avoir le rôle coach",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index pour améliorer les performances des requêtes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Middleware pour hacher le mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // -1s pour éviter les problèmes de timing JWT
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Middleware pour exclure les utilisateurs inactifs
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword || this.password);
};

// Méthode pour vérifier si le mot de passe a été changé après l'émission du token
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Méthode pour générer un token JWT
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      issuer: process.env.JWT_ISSUER || "your-app-name",
    }
  );
};

// Méthode pour générer un token de réinitialisation de mot de passe
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Virtual pour le nom complet
userSchema.virtual("fullName").get(function () {
  return this.name.trim();
});

module.exports = mongoose.model("User", userSchema);
