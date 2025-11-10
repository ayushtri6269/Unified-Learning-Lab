const asyncHandler = require('../utils/asyncHandler');
const User = require('../../models/User');
const Question = require('../../models/Question');
const Result = require('../../models/Result');
const {
    getAllQuestions,
    getQuestionsByCategory,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionStats,
    categories
} = require('../../models/QuestionByCategory');

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await User.countDocuments();

    res.json({
        success: true,
        data: users,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password -refreshToken');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.json({
        success: true,
        data: user
    });
});

/**
 * @desc    Update user
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res) => {
    const { name, email, role, isActive, permissions } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive !== 'undefined') user.isActive = isActive;
    if (permissions) user.permissions = permissions;

    await user.save();

    res.json({
        success: true,
        data: user
    });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // Don't allow deleting yourself
    if (user._id.toString() === req.user.id) {
        return res.status(400).json({
            success: false,
            message: 'You cannot delete your own account'
        });
    }

    await user.deleteOne();

    res.json({
        success: true,
        message: 'User deleted successfully'
    });
});

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get question counts from all category collections
    const questionStats = await getQuestionStats();
    const totalQuestions = Object.values(questionStats).reduce((sum, count) => sum + count, 0);

    const totalResults = await Result.countDocuments();

    // Get user registrations by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const usersByMonth = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ]);

    // Get users by role
    const usersByRole = await User.aggregate([
        {
            $group: {
                _id: '$role',
                count: { $sum: 1 }
            }
        }
    ]);

    // Recent users
    const recentUsers = await User.find()
        .select('name email role createdAt')
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({
        success: true,
        data: {
            overview: {
                totalUsers,
                activeUsers,
                totalQuestions,
                totalResults
            },
            questionsByCategory: questionStats,
            collections: {
                aptitude: 'aptitude_questions',
                coding: 'coding_questions',
                os: 'os_questions',
                dbms: 'dbms_questions',
                networks: 'networks_questions',
                quantitative: 'quantitative_questions',
                verbal: 'verbal_questions',
                logical: 'logical_questions',
                gk: 'gk_questions'
            },
            usersByMonth,
            usersByRole,
            recentUsers
        }
    });
});

/**
 * @desc    Get all questions
 * @route   GET /api/admin/questions
 * @access  Private/Admin
 */
/**
 * @desc    Get all questions (from all category collections)
 * @route   GET /api/admin/questions
 * @access  Private/Admin
 */
exports.getAllQuestions = asyncHandler(async (req, res) => {
    const { category } = req.query;

    let questions;
    if (category) {
        // Get questions from specific category collection
        questions = await getQuestionsByCategory(category);
    } else {
        // Get questions from all category collections
        questions = await getAllQuestions();
    }

    res.json({
        success: true,
        data: questions,
        message: `Retrieved from ${category ? category.toLowerCase() + '_questions' : 'all category collections'}`
    });
});

/**
 * @desc    Create question (in category-specific collection)
 * @route   POST /api/admin/questions
 * @access  Private/Admin
 */
exports.createQuestion = asyncHandler(async (req, res) => {
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({
            success: false,
            message: 'Category is required'
        });
    }

    // Create question in category-specific collection
    const question = await createQuestion(req.body);

    res.status(201).json({
        success: true,
        data: question,
        message: `Question added to ${category.toLowerCase()}_questions collection`
    });
});

/**
 * @desc    Update question (in category-specific collection)
 * @route   PUT /api/admin/questions/:id
 * @access  Private/Admin
 */
exports.updateQuestion = asyncHandler(async (req, res) => {
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({
            success: false,
            message: 'Category is required for update'
        });
    }

    const question = await updateQuestion(req.params.id, category, req.body);

    if (!question) {
        return res.status(404).json({
            success: false,
            message: 'Question not found in ' + category.toLowerCase() + '_questions collection'
        });
    }

    res.json({
        success: true,
        data: question,
        message: `Question updated in ${category.toLowerCase()}_questions collection`
    });
});

/**
 * @desc    Delete question (from category-specific collection)
 * @route   DELETE /api/admin/questions/:id
 * @access  Private/Admin
 */
exports.deleteQuestion = asyncHandler(async (req, res) => {
    const { category } = req.query;

    if (!category) {
        return res.status(400).json({
            success: false,
            message: 'Category query parameter is required'
        });
    }

    const question = await deleteQuestion(req.params.id, category);

    if (!question) {
        return res.status(404).json({
            success: false,
            message: 'Question not found in ' + category.toLowerCase() + '_questions collection'
        });
    }

    res.json({
        success: true,
        message: `Question deleted from ${category.toLowerCase()}_questions collection`
    });
});

/**
 * @desc    Get all results
 * @route   GET /api/admin/results
 * @access  Private/Admin
 */
exports.getAllResults = asyncHandler(async (req, res) => {
    const results = await Result.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(100);

    res.json({
        success: true,
        data: results
    });
});
