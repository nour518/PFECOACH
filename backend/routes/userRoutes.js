const bcrypt = require("bcryptjs"); // Ajoutez cette ligne
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Fonction pour créer un objet erreur standardisé
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  return error;
};

// ✅ Inscription
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(createError("Tous les champs sont requis", 400));
    }

    if (!validator.isEmail(email)) {
      return next(createError("Veuillez fournir un email valide", 400));
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return next(createError("Cet email est déjà utilisé.", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "user",
    });

    if (!process.env.JWT_SECRET) {
      return next(createError("Erreur interne : clé JWT manquante", 500));
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );

    res.status(201).json({
      status: "success",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Erreur lors de l'inscription :", err);
    next(createError("Une erreur est survenue lors de l'inscription", 500));
  }
});
