const { summarizeText, generateQuiz, generateLesson } = require('../services/aiService');
const { generateQuizFromSummary } = require('../services/ai/quizService');
const { extractTextFromPDF } = require('../services/pdfService');
const { pool } = require('../config/db');

const extractPDF = (req, res) => {
  req.uploadPDF(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ error: err.message || 'File upload failed.' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file provided.' });
      }

      console.log(`[materialController] 📥 File received: "${req.file.originalname}" (${req.file.size} bytes)`);
      const result = await extractTextFromPDF(req.file.buffer);

      res.status(200).json({
        text: result.text,
        fileName: req.file.originalname,
        pageCount: result.pageCount,
        characterCount: result.characterCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const isUserError = error.message?.includes('image') || error.message?.includes('No file buffer');
      console.error(`[materialController] ❌ ${isUserError ? 'User error' : 'Server error'}: ${error.message}`);
      res.status(isUserError ? 422 : 500).json({ error: error.message || 'Failed to extract text from PDF.' });
    }
  });
};

const summarize = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required and cannot be empty.' });
    }
    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text is too long. Maximum 5000 characters allowed.' });
    }

    const summary = await summarizeText(text);
    res.status(200).json({ summary, original_length: text.length, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[materialController] summarize error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to summarize text.' });
  }
};

const generateQuizFromPrompt = async (req, res) => {
  try {
    const { category, subCategory, prompt } = req.body;

    if (!category || !subCategory || !prompt) {
      return res.status(400).json({ error: 'Missing required fields: category, subCategory, prompt.' });
    }
    if (typeof prompt !== 'string' || prompt.trim().length === 0 || prompt.length > 2000) {
      return res.status(400).json({ error: 'Prompt must be a non-empty string under 2000 characters.' });
    }

    const quiz = await generateQuiz(category, subCategory, prompt);
    res.status(200).json({ quiz, category, subCategory, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[materialController] generateQuizFromPrompt error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate quiz.' });
  }
};

const generateLessonFromPrompt = async (req, res) => {
  try {
    const { category, subCategory, prompt } = req.body;

    if (!category || !subCategory || !prompt) {
      return res.status(400).json({ error: 'Missing required fields: category, subCategory, prompt.' });
    }
    if (typeof prompt !== 'string' || prompt.trim().length === 0 || prompt.length > 2000) {
      return res.status(400).json({ error: 'Prompt must be a non-empty string under 2000 characters.' });
    }

    const lesson = await generateLesson(category, subCategory, prompt);
    res.status(200).json({ lesson, category, subCategory, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[materialController] generateLessonFromPrompt error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate lesson.' });
  }
};

const generateQuizFromSummaryRoute = async (req, res) => {
  try {
    const { summary } = req.body;

    if (!summary || typeof summary !== 'string' || summary.trim().length === 0) {
      return res.status(400).json({ error: 'Summary is required and cannot be empty.' });
    }
    if (summary.length > 5000) {
      return res.status(400).json({ error: 'Summary is too long. Maximum 5000 characters allowed.' });
    }

    const quiz = await generateQuizFromSummary(summary);
    res.status(200).json({ quiz, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[materialController] generateQuizFromSummaryRoute error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate quiz.' });
  }
};

const getAllMaterials = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materials ORDER BY created_at DESC');
    res.status(200).json({ materials: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('[materialController] getAllMaterials error:', error.message);
    res.status(500).json({ error: 'Failed to fetch materials.' });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid material ID.' });

    const result = await pool.query('SELECT * FROM materials WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Material not found.' });

    res.status(200).json({ material: result.rows[0] });
  } catch (error) {
    console.error('[materialController] getMaterialById error:', error.message);
    res.status(500).json({ error: 'Failed to fetch material.' });
  }
};

const saveMaterial = async (req, res) => {
  try {
    const { title, original_text, summary, quiz } = req.body;

    if (!title?.trim() || !original_text?.trim()) {
      return res.status(400).json({ error: 'title and original_text are required.' });
    }

    const result = await pool.query(
      'INSERT INTO materials (title, original_text, summary, quiz) VALUES ($1, $2, $3, $4) RETURNING *',
      [title.trim(), original_text.trim(), summary || null, quiz ? JSON.stringify(quiz) : null]
    );

    res.status(201).json({ material: result.rows[0], message: 'Material saved successfully.' });
  } catch (error) {
    console.error('[materialController] saveMaterial error:', error.message);
    res.status(500).json({ error: 'Failed to save material.' });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid material ID.' });

    const result = await pool.query('DELETE FROM materials WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Material not found.' });

    res.status(200).json({ message: 'Material deleted successfully.', material: result.rows[0] });
  } catch (error) {
    console.error('[materialController] deleteMaterial error:', error.message);
    res.status(500).json({ error: 'Failed to delete material.' });
  }
};

const generateQuizForMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { summary } = req.body;
    if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid material ID.' });
    if (!summary?.trim()) return res.status(400).json({ error: 'Summary is required.' });
    if (summary.length > 5000) return res.status(400).json({ error: 'Summary too long.' });

    const materialCheck = await pool.query('SELECT id FROM materials WHERE id = $1', [id]);
    if (materialCheck.rows.length === 0) return res.status(404).json({ error: 'Material not found.' });

    const quiz = await generateQuizFromSummary(summary);
    const result = await pool.query('UPDATE materials SET quiz = $1 WHERE id = $2 RETURNING *', [JSON.stringify(quiz), id]);

    res.status(200).json({ quiz, material: result.rows[0], timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[materialController] generateQuizForMaterial error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate quiz.' });
  }
};

const generateAndSaveQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid material ID.' });

    const materialCheck = await pool.query('SELECT id, summary FROM materials WHERE id = $1', [id]);
    if (materialCheck.rows.length === 0) return res.status(404).json({ error: 'Material not found.' });

    const { summary } = materialCheck.rows[0];
    if (!summary) return res.status(400).json({ error: 'Material has no summary. Generate a summary first.' });

    const questions = await generateQuizFromSummary(summary);

    const insertResult = await pool.query(
      'INSERT INTO quizzes (material_id, questions) VALUES ($1, $2) RETURNING *',
      [id, JSON.stringify(questions)]
    );
    await pool.query('UPDATE materials SET quiz = $1 WHERE id = $2', [JSON.stringify(questions), id]);

    res.status(200).json({
      quiz: questions,
      quizId: insertResult.rows[0].id,
      materialId: id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[materialController] generateAndSaveQuizById error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate quiz.' });
  }
};

module.exports = {
  extractPDF,
  summarize,
  generateQuizFromPrompt,
  generateLessonFromPrompt,
  generateQuizFromSummaryRoute,
  getAllMaterials,
  getMaterialById,
  saveMaterial,
  deleteMaterial,
  generateQuizForMaterial,
  generateAndSaveQuizById,
};
