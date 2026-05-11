const express = require('express');
const { pool } = require('../config/db');

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM categories ORDER BY name');
    res.status(200).json({
      categories: result.rows,
    });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({
      error: 'Failed to fetch categories',
    });
  }
});

// GET /api/categories/:categoryId/subcategories
router.get('/:categoryId/subcategories', async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({
        error: 'Invalid category ID',
      });
    }

    const result = await pool.query(
      'SELECT id, name FROM sub_categories WHERE category_id = $1 ORDER BY name',
      [categoryId]
    );

    res.status(200).json({
      subCategories: result.rows,
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error.message);
    res.status(500).json({
      error: 'Failed to fetch subcategories',
    });
  }
});

module.exports = router;
