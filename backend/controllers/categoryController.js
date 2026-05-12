const { pool } = require('../config/db');

const getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM categories ORDER BY name');
    res.status(200).json({ categories: result.rows });
  } catch (error) {
    console.error('[categoryController] getCategories error:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID.' });
    }

    const result = await pool.query(
      'SELECT id, name FROM sub_categories WHERE category_id = $1 ORDER BY name',
      [categoryId]
    );

    res.status(200).json({ subCategories: result.rows });
  } catch (error) {
    console.error('[categoryController] getSubCategories error:', error.message);
    res.status(500).json({ error: 'Failed to fetch subcategories.' });
  }
};

module.exports = { getCategories, getSubCategories };
