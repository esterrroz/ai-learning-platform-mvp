const express = require('express');
const router = express.Router();
const { registerUser, getUsers, getPrompts, getUserPrompts } = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User registration and prompt history
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:  { type: string, example: Israel Cohen }
 *               phone: { type: string, example: '050-1234567' }
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/', registerUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 */
router.get('/', getUsers);

/**
 * @swagger
 * /api/users/prompts:
 *   get:
 *     summary: Get all prompts across all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of prompts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Prompt' }
 */
router.get('/prompts', getPrompts);

/**
 * @swagger
 * /api/users/{userId}/prompts:
 *   get:
 *     summary: Get all prompts for a specific user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of prompts for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Prompt' }
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/:userId/prompts', getUserPrompts);

module.exports = router;
