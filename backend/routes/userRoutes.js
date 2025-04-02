const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes publiques
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Routes protégées
router.get('/me', authMiddleware.protect, userController.getProfile);

module.exports = router;