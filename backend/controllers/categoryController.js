const { pool } = require('../config/db');

// קבלת כל הקטגוריות הראשיות
const getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM categories ORDER BY name');
    res.status(200).json({ categories: result.rows });
  } catch (error) {
    console.error('[categoryController] שגיאת קבלת קטגוריות:', error.message);
    res.status(500).json({ error: 'קבלת הקטגוריות נכשלה.' });
  }
};

// קבלת תת-קטגוריות לפי מזהה קטגוריה
const getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({ error: 'מזהה קטגוריה לא תקין.' });
    }

    const result = await pool.query(
      'SELECT id, name FROM sub_categories WHERE category_id = $1 ORDER BY name',
      [categoryId]
    );

    res.status(200).json({ subCategories: result.rows });
  } catch (error) {
    console.error('[categoryController] שגיאת קבלת תת-קטגוריות:', error.message);
    res.status(500).json({ error: 'קבלת תת-הקטגוריות נכשלה.' });
  }
};

module.exports = { getCategories, getSubCategories };
