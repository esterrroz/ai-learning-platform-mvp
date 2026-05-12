const { pool } = require('../config/db');

const getPrompts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.prompt, p.response, p.created_at,
             u.name AS user_name, u.phone AS user_phone,
             c.name AS category_name, sc.name AS sub_category_name
      FROM prompts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sub_categories sc ON p.sub_category_id = sc.id
      ORDER BY p.created_at DESC
    `);
    res.status(200).json({ prompts: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('[userController] getPrompts error:', error.message);
    res.status(500).json({ error: 'Failed to fetch prompts.' });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required.' });
    }

    if (name.trim().length > 255) {
      return res.status(400).json({ error: 'Name is too long.' });
    }

    if (phone && typeof phone === 'string' && phone.trim().length > 20) {
      return res.status(400).json({ error: 'Phone number is too long.' });
    }

    const result = await pool.query(
      'INSERT INTO users (name, phone) VALUES ($1, $2) RETURNING id, name, phone, created_at',
      [name.trim(), phone?.trim() || null]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('[userController] registerUser error:', error.message);
    res.status(500).json({ error: 'Failed to register user.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, phone, created_at FROM users ORDER BY created_at DESC'
    );
    res.status(200).json({ users: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('[userController] getUsers error:', error.message);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

module.exports = { registerUser, getUsers, getPrompts };
