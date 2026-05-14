const { summarizeText, generateQuiz, generateLesson } = require('../services/aiService');
const { generateQuizFromSummary } = require('../services/ai/quizService');
const { pool } = require('../config/db');

// סיכום טקסט באמצעות AI
const summarize = async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'טקסט הוא שדה חובה ולא יכול להיות ריק.' });
    }
    if (text.length > 5000) {
      return res.status(400).json({ error: 'הטקסט ארוך מדי. מקסימום 5000 תווים.' });
    }

    const summary = await summarizeText(text);

    // שמירת הפרומפט בהיסטוריה אם יש userId, categoryId ו-subCategoryId
    if (userId && !isNaN(userId)) {
      const { categoryId, subCategoryId } = req.body;
      if (categoryId && subCategoryId && !isNaN(categoryId) && !isNaN(subCategoryId)) {
        pool.query(
          'INSERT INTO prompts (user_id, category_id, sub_category_id, prompt, response) VALUES ($1, $2, $3, $4, $5)',
          [userId, categoryId, subCategoryId, text.substring(0, 500), summary]
        ).catch(err => console.error('[materialController] שגיאת שמירת פרומפט:', err.message));
      }
    }

    res.status(200).json({ summary, original_length: text.length, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[materialController] שגיאת סיכום:', error.message);
    res.status(500).json({ error: error.message || 'סיכום הטקסט נכשל.' });
  }
};

// יצירת חידון מפרומפט חופשי (ללא חומר שמור)
const generateQuizFromPrompt = async (req, res) => {
  try {
    const { category, subCategory, prompt, userId } = req.body;

    if (!category || !subCategory || !prompt) {
      return res.status(400).json({ error: 'שדות חובה חסרים: category, subCategory, prompt.' });
    }
    if (typeof prompt !== 'string' || prompt.trim().length === 0 || prompt.length > 2000) {
      return res.status(400).json({ error: 'הפרומפט חייב להיות מחרוזת לא ריקה עד 2000 תווים.' });
    }

    const quiz = await generateQuiz(category, subCategory, prompt);

    // שמירת הפרומפט בהיסטוריה
    if (userId && !isNaN(userId)) {
      const { categoryId, subCategoryId } = req.body;
      if (categoryId && subCategoryId && !isNaN(categoryId) && !isNaN(subCategoryId)) {
        pool.query(
          'INSERT INTO prompts (user_id, category_id, sub_category_id, prompt, response) VALUES ($1, $2, $3, $4, $5)',
          [userId, categoryId, subCategoryId, prompt, JSON.stringify(quiz)]
        ).catch(err => console.error('[materialController] שגיאת שמירת פרומפט:', err.message));
      }
    }

    res.status(200).json({ quiz, category, subCategory, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[materialController] שגיאת יצירת חידון מפרומפט:', error.message);
    res.status(500).json({ error: error.message || 'יצירת החידון נכשלה.' });
  }
};

// יצירת שיעור מפרומפט חופשי
const generateLessonFromPrompt = async (req, res) => {
  try {
    const { category, subCategory, prompt, userId } = req.body;

    if (!category || !subCategory || !prompt) {
      return res.status(400).json({ error: 'שדות חובה חסרים: category, subCategory, prompt.' });
    }
    if (typeof prompt !== 'string' || prompt.trim().length === 0 || prompt.length > 2000) {
      return res.status(400).json({ error: 'הפרומפט חייב להיות מחרוזת לא ריקה עד 2000 תווים.' });
    }

    const lesson = await generateLesson(category, subCategory, prompt);

    // שמירת הפרומפט בהיסטוריה
    if (userId && !isNaN(userId)) {
      const { categoryId, subCategoryId } = req.body;
      if (categoryId && subCategoryId && !isNaN(categoryId) && !isNaN(subCategoryId)) {
        pool.query(
          'INSERT INTO prompts (user_id, category_id, sub_category_id, prompt, response) VALUES ($1, $2, $3, $4, $5)',
          [userId, categoryId, subCategoryId, prompt, lesson]
        ).catch(err => console.error('[materialController] שגיאת שמירת פרומפט:', err.message));
      }
    }

    res.status(200).json({ lesson, category, subCategory, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[materialController] שגיאת יצירת שיעור:', error.message);
    res.status(500).json({ error: error.message || 'יצירת השיעור נכשלה.' });
  }
};

// יצירת חידון מסיכום טקסט (ללא שמירה לבסיס הנתונים)
const generateQuizFromSummaryRoute = async (req, res) => {
  try {
    const { summary, lang } = req.body;

    if (!summary || typeof summary !== 'string' || summary.trim().length === 0) {
      return res.status(400).json({ error: 'סיכום הוא שדה חובה ולא יכול להיות ריק.' });
    }
    if (summary.length > 5000) {
      return res.status(400).json({ error: 'הסיכום ארוך מדי. מקסימום 5000 תווים.' });
    }

    // lang מגיע מהפרונטאנד ('he' או 'en')
    const quiz = await generateQuizFromSummary(summary, lang || 'he');
    res.status(200).json({ quiz, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[materialController] שגיאת יצירת חידון מסיכום:', error.message);
    res.status(500).json({ error: error.message || 'יצירת החידון נכשלה.' });
  }
};

// קבלת כל חומרי הלימוד השמורים
const getAllMaterials = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materials ORDER BY created_at DESC');
    res.status(200).json({ materials: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('[materialController] שגיאת קבלת חומרים:', error.message);
    res.status(500).json({ error: 'קבלת החומרים נכשלה.' });
  }
};

// קבלת חומר לימוד בודד לפי ID
const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ error: 'מזהה חומר לא תקין.' });

    const result = await pool.query('SELECT * FROM materials WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'החומר לא נמצא.' });

    res.status(200).json({ material: result.rows[0] });
  } catch (error) {
    console.error('[materialController] שגיאת קבלת חומר:', error.message);
    res.status(500).json({ error: 'קבלת החומר נכשלה.' });
  }
};

// שמירת חומר לימוד חדש לבסיס הנתונים
const saveMaterial = async (req, res) => {
  try {
    const { title, original_text, summary, quiz, userId } = req.body;

    if (!title?.trim() || !original_text?.trim()) {
      return res.status(400).json({ error: 'title ו-original_text הם שדות חובה.' });
    }

    const result = await pool.query(
      'INSERT INTO materials (user_id, title, original_text, summary, quiz) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId || null, title.trim(), original_text.trim(), summary || null, quiz ? JSON.stringify(quiz) : null]
    );

    res.status(201).json({ material: result.rows[0], message: 'החומר נשמר בהצלחה.' });
  } catch (error) {
    console.error('[materialController] שגיאת שמירת חומר:', error.message);
    res.status(500).json({ error: 'שמירת החומר נכשלה.' });
  }
};

// מחיקת חומר לימוד לפי ID
const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ error: 'מזהה חומר לא תקין.' });

    const result = await pool.query('DELETE FROM materials WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'החומר לא נמצא.' });

    res.status(200).json({ message: 'החומר נמחק בהצלחה.', material: result.rows[0] });
  } catch (error) {
    console.error('[materialController] שגיאת מחיקת חומר:', error.message);
    res.status(500).json({ error: 'מחיקת החומר נכשלה.' });
  }
};

// יצירת חידון לחומר שמור ועדכון שדה quiz בטבלת materials
const generateQuizForMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { summary, lang } = req.body;
    if (!id || isNaN(id)) return res.status(400).json({ error: 'מזהה חומר לא תקין.' });
    if (!summary?.trim()) return res.status(400).json({ error: 'סיכום הוא שדה חובה.' });
    if (summary.length > 5000) return res.status(400).json({ error: 'הסיכום ארוך מדי.' });

    const materialCheck = await pool.query('SELECT id FROM materials WHERE id = $1', [id]);
    if (materialCheck.rows.length === 0) return res.status(404).json({ error: 'החומר לא נמצא.' });

    const quiz = await generateQuizFromSummary(summary, lang || 'he');
    const result = await pool.query('UPDATE materials SET quiz = $1 WHERE id = $2 RETURNING *', [JSON.stringify(quiz), id]);

    res.status(200).json({ quiz, material: result.rows[0], timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[materialController] שגיאת יצירת חידון לחומר:', error.message);
    res.status(500).json({ error: error.message || 'יצירת החידון נכשלה.' });
  }
};

// יצירת חידון לחומר שמור ושמירתו גם בטבלת quizzes
const generateAndSaveQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const { lang } = req.body;
    if (!id || isNaN(id)) return res.status(400).json({ error: 'מזהה חומר לא תקין.' });

    const materialCheck = await pool.query('SELECT id, summary FROM materials WHERE id = $1', [id]);
    if (materialCheck.rows.length === 0) return res.status(404).json({ error: 'החומר לא נמצא.' });

    const { summary } = materialCheck.rows[0];
    if (!summary) return res.status(400).json({ error: 'לחומר אין סיכום. צור סיכום תחילה.' });

    const questions = await generateQuizFromSummary(summary, lang || 'he');

    // שמירה בטבלת quizzes וגם עדכון שדה quiz בטבלת materials
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
    console.error('[materialController] שגיאת יצירת ושמירת חידון:', error.message);
    res.status(500).json({ error: error.message || 'יצירת החידון נכשלה.' });
  }
};

module.exports = {
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
