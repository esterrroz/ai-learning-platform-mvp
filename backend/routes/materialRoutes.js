const express = require('express');
const { summarizeText, generateQuiz } = require('../services/aiService');
const { generateQuizFromSummary } = require('../services/ai/quizService');
const { pool } = require('../config/db');

const router = express.Router();

// POST /api/materials/summarize
router.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body;

    // Validation
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Invalid input. Please provide a "text" field with a string value.',
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text cannot be empty.',
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: 'Text is too long. Maximum 5000 characters allowed.',
      });
    }

    // Call AI service
    const summary = await summarizeText(text);

    res.status(200).json({
      summary,
      original_length: text.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in summarize route:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to summarize text',
    });
  }
});

// POST /api/materials/generateQuiz
router.post('/generateQuiz', async (req, res) => {
  try {
    const { category, subCategory, prompt } = req.body;

    // Validation
    if (!category || !subCategory || !prompt) {
      return res.status(400).json({
        error: 'Missing required fields: category, subCategory, prompt',
      });
    }

    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Prompt must be a non-empty string',
      });
    }

    if (prompt.length > 2000) {
      return res.status(400).json({
        error: 'Prompt is too long. Maximum 2000 characters allowed.',
      });
    }

    // Call AI service
    const quiz = await generateQuiz(category, subCategory, prompt);

    res.status(200).json({
      quiz,
      category,
      subCategory,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in generateQuiz route:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to generate quiz',
    });
  }
});

// POST /api/materials/generate-quiz
router.post('/generate-quiz', async (req, res) => {
  try {
    const { summary } = req.body;

    // Validation
    if (!summary || typeof summary !== 'string') {
      return res.status(400).json({
        error: 'Invalid input. Please provide a "summary" field with a string value.',
      });
    }

    if (summary.trim().length === 0) {
      return res.status(400).json({
        error: 'Summary cannot be empty.',
      });
    }

    if (summary.length > 5000) {
      return res.status(400).json({
        error: 'Summary is too long. Maximum 5000 characters allowed.',
      });
    }

    // Call AI service
    const quiz = await generateQuizFromSummary(summary);

    res.status(200).json({
      quiz,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in generate-quiz route:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to generate quiz',
    });
  }
});

module.exports = router;
