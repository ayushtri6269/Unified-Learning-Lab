const express = require('express');
const {
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all questions or create new question
router.route('/')
    .get(getQuestions)
    .post(protect, authorize('admin'), createQuestion);

// Get questions by category (e.g., /api/questions/Aptitude)
router.route('/:category')
    .get(getQuestions);

// Get, update, or delete a single question
router.route('/:id')
    .put(protect, authorize('admin'), updateQuestion)
    .delete(protect, authorize('admin'), deleteQuestion);

module.exports = router;
