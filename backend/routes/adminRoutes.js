const express = require("express");
const { check } = require("express-validator");

const {

  login,
  createSpecificAdmin,
  getAllUsers,
  deleteUserById,
  getAllQuestions,
  addQuestion,
  deleteQuestion,
  updateQuestion,

} = require("../controllers/adminController");

const { protect, checkAdmin } = require("../middleware/authMiddleware");
const Question = require("../models/Question");
const router = express.Router();

// Routes Admin

router.post("/login", login);
router.get("/create-specific-admin", createSpecificAdmin);


// Routes Utilisateurs
router.get('/users', protect, checkAdmin, getAllUsers);
router.delete('/users/:id', protect, checkAdmin, deleteUserById);

router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    console.error('Erreur lors de la récupération des questions:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
});


router.post('/questions', protect, checkAdmin, addQuestion);
router.route('/questions/:id')
  .put(protect, checkAdmin, updateQuestion)
  .delete(protect, checkAdmin, deleteQuestion);

module.exports = router;