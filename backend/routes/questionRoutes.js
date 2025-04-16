const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Route pour récupérer toutes les questions
router.get('/', questionController.getQuestions);

// Route pour initialiser les questions
router.post('/initialize', questionController.initializeQuestions);

module.exports = router;
