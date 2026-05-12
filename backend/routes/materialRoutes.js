const express = require('express');
const { summarizeText, generateQuiz } = require('../services/aiService');
const { generateQuizFromSummary } = require('../services/ai/quizService');
const { extractTextFromPDF } = require('../services/pdfService');
const { pool } = require('../config/db');

const router = express.Router();

// POST /api/materials/extract-pdf - Extract text from uploaded PDF
router.post('/extract-pdf', (req, res) => {
  req.uploadPDF(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err) {
        return res.status(400).json({
          error: err.message || 'File upload failed',
        });
      }

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          error: 'No PDF file provided. Please upload a PDF file.',
        });
      }

      // Extract text from PDF
      const result = await extractTextFromPDF(req.file.buffer);

      res.status(200).json({
        text: result.text,
        fileName: req.file.originalname,
        pageCount: result.pageCount,
        characterCount: result.characterCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error extracting PDF:', error.message);
      res.status(500).json({
        error: error.message || 'Failed to extract text from PDF',
      });
    }
  });
});

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

// GET /api/materials - Fetch all materials from database
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM materials ORDER BY created_at DESC'
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        materials: [],
        message: 'No materials found',
      });
    }

    res.status(200).json({
      materials: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching materials:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch materials',
    });
  }
});

// GET /api/materials/:id - Fetch a single material by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid material ID',
      });
    }

    const result = await pool.query(
      'SELECT * FROM materials WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Material not found',
      });
    }

    res.status(200).json({
      material: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching material:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch material',
    });
  }
});

// POST /api/materials - Save a new material with summary and/or quiz
router.post('/', async (req, res) => {
  try {
    const { title, original_text, summary, quiz } = req.body;

    // Validation
    if (!title || !original_text) {
      return res.status(400).json({
        error: 'Missing required fields: title, original_text',
      });
    }

    if (title.trim().length === 0 || original_text.trim().length === 0) {
      return res.status(400).json({
        error: 'Title and original_text cannot be empty',
      });
    }

    const result = await pool.query(
      'INSERT INTO materials (title, original_text, summary, quiz) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, original_text, summary || null, quiz ? JSON.stringify(quiz) : null]
    );

    res.status(201).json({
      material: result.rows[0],
      message: 'Material saved successfully',
    });
  } catch (error) {
    console.error('Error saving material:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to save material',
    });
  }
});

// DELETE /api/materials/:id - Delete a material
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid material ID',
      });
    }

    const result = await pool.query(
      'DELETE FROM materials WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Material not found',
      });
    }

    res.status(200).json({
      message: 'Material deleted successfully',
      material: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting material:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to delete material',
    });
  }
});

// POST /api/materials/:id/quiz - Generate and save quiz for a specific material
router.post('/:id/quiz', async (req, res) => {
  try {
    const { id } = req.params;
    const { summary } = req.body;

    // Validation
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid material ID',
      });
    }

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

    // Check if material exists
    const materialCheck = await pool.query(
      'SELECT id FROM materials WHERE id = $1',
      [id]
    );

    if (materialCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Material not found',
      });
    }

    // Call AI service to generate quiz
    const quiz = await generateQuizFromSummary(summary);

    // Update material with quiz
    const result = await pool.query(
      'UPDATE materials SET quiz = $1 WHERE id = $2 RETURNING *',
      [JSON.stringify(quiz), id]
    );

    res.status(200).json({
      quiz,
      material: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating quiz for material:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to generate quiz',
    });
  }
});

// POST /api/materials/:id/generate-quiz - Generate quiz for a specific material (alternative route)
router.post('/:id/generate-quiz', async (req, res) => {
  try {
    const { id } = req.params;

    // Validation
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid material ID',
      });
    }

    // Check if material exists and get its summary
    const materialCheck = await pool.query(
      'SELECT id, summary FROM materials WHERE id = $1',
      [id]
    );

    if (materialCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Material not found',
      });
    }

    const { summary } = materialCheck.rows[0];

    if (!summary) {
      return res.status(400).json({
        error: 'Material does not have a summary. Please generate a summary first.',
      });
    }

    // Call AI service to generate quiz
    const questions = await generateQuizFromSummary(summary);

    // Insert quiz into quizzes table
    const insertResult = await pool.query(
      'INSERT INTO quizzes (material_id, questions) VALUES ($1, $2) RETURNING *',
      [id, JSON.stringify(questions)]
    );

    // Also update material with quiz
    await pool.query(
      'UPDATE materials SET quiz = $1 WHERE id = $2',
      [JSON.stringify(questions), id]
    );

    res.status(200).json({
      quiz: questions,
      quizId: insertResult.rows[0].id,
      materialId: id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating quiz for material:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to generate quiz',
    });
  }
});

module.exports = router;
