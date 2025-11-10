const asyncHandler = require('../utils/asyncHandler');
const {
  getAllQuestions,
  getQuestionsByCategory,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionModel
} = require('../../models/QuestionByCategory');

/**
 * @desc    Get all questions or questions by category
 * @route   GET /api/questions
 * @route   GET /api/questions/:category
 * @access  Public
 */
exports.getQuestions = asyncHandler(async (req, res) => {
    const { category, difficulty } = req.query;
    const categoryParam = req.params.category; // From URL path

    let filter = {};
    if (difficulty) filter.difficulty = difficulty;

    let questions;

    // Check if category is in URL path (e.g., /api/questions/Aptitude)
    if (categoryParam) {
        questions = await getQuestionsByCategory(categoryParam, filter);
    } else if (category) {
        // Check if category is in query string (e.g., /api/questions?category=Aptitude)
        questions = await getQuestionsByCategory(category, filter);
    } else {
        // Get all questions from all collections
        questions = await getAllQuestions(filter);
    }

    res.json({
        success: true,
        count: questions.length,
        data: questions,
    });
});

/**
 * @desc    Get single question
 * @route   GET /api/questions/:category/:id
 * @access  Public
 */
exports.getQuestion = asyncHandler(async (req, res) => {
    const { category, id } = req.params;

    if (!category) {
        return res.status(400).json({
            success: false,
            message: 'Category is required',
        });
    }

    const Model = getQuestionModel(category);
    const question = await Model.findById(id);

    if (!question) {
        return res.status(404).json({
            success: false,
            message: 'Question not found',
        });
    }

    res.json({
        success: true,
        data: question,
    });
});

/**
 * @desc    Create question
 * @route   POST /api/questions
 * @access  Private/Admin
 */
exports.createQuestion = asyncHandler(async (req, res) => {
    const question = await createQuestion(req.body);

    res.status(201).json({
        success: true,
        data: question,
    });
});

/**
 * @desc    Update question
 * @route   PUT /api/questions/:id
 * @access  Private/Admin
 */
exports.updateQuestion = asyncHandler(async (req, res) => {
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({
            success: false,
            message: 'Category is required',
        });
    }

    const question = await updateQuestion(req.params.id, category, req.body);

    if (!question) {
        return res.status(404).json({
            success: false,
            message: 'Question not found',
        });
    }

    res.json({
        success: true,
        data: question,
    });
});

/**
 * @desc    Delete question
 * @route   DELETE /api/questions/:id?category=CategoryName
 * @access  Private/Admin
 */
exports.deleteQuestion = asyncHandler(async (req, res) => {
    const { category } = req.query;

    if (!category) {
        return res.status(400).json({
            success: false,
            message: 'Category is required',
        });
    }

    const question = await deleteQuestion(req.params.id, category);

    if (!question) {
        return res.status(404).json({
            success: false,
            message: 'Question not found',
        });
    }

    res.json({
        success: true,
        data: {},
    });
});
