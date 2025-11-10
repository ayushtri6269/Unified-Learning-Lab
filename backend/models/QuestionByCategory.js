const mongoose = require('mongoose');

// Base Question Schema
const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  category: { type: String, required: true }
}, { timestamps: true });

// Category-specific models
const categories = ['Aptitude', 'Coding', 'OS', 'DBMS', 'Networks', 'Quantitative', 'Verbal', 'Logical', 'GK', 'Miscellaneous'];

// Create models for each category
const QuestionModels = {};

categories.forEach(category => {
  const collectionName = `${category.toLowerCase()}_questions`;
  QuestionModels[category] = mongoose.model(
    `${category}Question`,
    QuestionSchema,
    collectionName
  );
});

// Helper function to get model by category
const getQuestionModel = (category) => {
  if (!QuestionModels[category]) {
    throw new Error(`Invalid category: ${category}. Valid categories are: ${categories.join(', ')}`);
  }
  return QuestionModels[category];
};

// Get all questions from all collections
const getAllQuestions = async (filters = {}) => {
  const allQuestions = [];

  for (const category of categories) {
    const Model = QuestionModels[category];
    const questions = await Model.find(filters);
    allQuestions.push(...questions.map(q => ({
      ...q.toObject(),
      category: category
    })));
  }

  return allQuestions;
};

// Get questions by category
const getQuestionsByCategory = async (category, filters = {}) => {
  const Model = getQuestionModel(category);
  return await Model.find(filters);
};

// Create question in specific collection
const createQuestion = async (questionData) => {
  const { category, ...data } = questionData;
  const Model = getQuestionModel(category);

  const question = new Model({
    ...data,
    category: category
  });

  return await question.save();
};

// Update question
const updateQuestion = async (id, category, updateData) => {
  const Model = getQuestionModel(category);
  return await Model.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete question
const deleteQuestion = async (id, category) => {
  const Model = getQuestionModel(category);
  return await Model.findByIdAndDelete(id);
};

// Count questions per category
const getQuestionStats = async () => {
  const stats = {};

  for (const category of categories) {
    const Model = QuestionModels[category];
    stats[category] = await Model.countDocuments();
  }

  return stats;
};

module.exports = {
  QuestionModels,
  getQuestionModel,
  getAllQuestions,
  getQuestionsByCategory,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionStats,
  categories
};
