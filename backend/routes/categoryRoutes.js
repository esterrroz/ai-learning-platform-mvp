const express = require('express');
const router = express.Router();
const { getCategories, getSubCategories } = require('../controllers/categoryController');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Learning categories and sub-categories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Category' }
 */
router.get('/', getCategories);

/**
 * @swagger
 * /api/categories/{categoryId}/subcategories:
 *   get:
 *     summary: Get sub-categories for a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema: { type: integer }
 *         description: The category ID
 *     responses:
 *       200:
 *         description: List of sub-categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/SubCategory' }
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/:categoryId/subcategories', getSubCategories);

module.exports = router;
