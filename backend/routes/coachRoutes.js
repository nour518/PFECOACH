const express = require('express');
const router = express.Router();
const { addCoach, getAllCoaches, getCoachById, updateCoach, deleteCoach } = require('../controllers/coachController');
const protect = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

router.post('/add', protect, checkRole('admin'), addCoach); // Ajout d'un coach par un admin
router.get('/', protect, checkRole('coach'), getAllCoaches); // Récupérer tous les coachs (pour les coachs uniquement)
router.get('/:id', protect, checkRole('coach'), getCoachById); // Détails d'un coach
router.put('/:id', protect, checkRole('coach'), updateCoach); // Mise à jour d'un coach
router.delete('/:id', protect, checkRole('admin'), deleteCoach); // Suppression d'un coach (admin uniquement)

module.exports = router;
