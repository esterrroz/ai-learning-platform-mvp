const express = require('express');
const { summarizeText } = require('../services/aiService');

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

module.exports = router;
