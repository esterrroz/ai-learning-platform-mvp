const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication — login and receive a JWT
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with name and phone to receive a JWT
 *     tags: [Auth]
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
 *       200:
 *         description: JWT token + user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user:  { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Bad request
 */
router.post('/login', async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required.' });

    // Upsert: find existing user by name+phone or create new
    let result = await pool.query(
      'SELECT id, name, phone FROM users WHERE name = $1 AND (phone = $2 OR (phone IS NULL AND $2 IS NULL)) LIMIT 1',
      [name.trim(), phone?.trim() || null]
    );

    if (result.rows.length === 0) {
      result = await pool.query(
        'INSERT INTO users (name, phone) VALUES ($1, $2) RETURNING id, name, phone',
        [name.trim(), phone?.trim() || null]
      );
    }

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    console.error('[authRoutes] login error:', error.message);
    res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router;
