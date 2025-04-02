const express = require('express');
const router = express.Router();
const planActionController = require('../controllers/PlanActionController');

router.get('/plan-action/:userId', planActionController.getPlanAction);
router.put('/plan-action/:userId/task/:taskId', planActionController.updateTaskStatus);

module.exports = router;