const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

// DDL statements executed in dependency order
const DDL = [
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS sub_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE (name, category_id)
  )`,

  `CREATE TABLE IF NOT EXISTS prompts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    sub_category_id INTEGER NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    original_text TEXT NOT NULL,
    summary TEXT,
    quiz JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    questions JSONB NOT NULL,
    score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
];

const CATEGORY_SEEDS = [
  'English',
  'Mathematics',
  'History',
  'Biology',
  'Grammar',
];

const SUB_CATEGORY_SEEDS = [
  { name: 'Grammar',        category: 'English'     },
  { name: 'Vocabulary',     category: 'English'     },
  { name: 'Literature',     category: 'English'     },
  { name: 'Algebra',        category: 'Mathematics' },
  { name: 'Geometry',       category: 'Mathematics' },
  { name: 'Calculus',       category: 'Mathematics' },
  { name: 'Ancient History',category: 'History'     },
  { name: 'Modern History', category: 'History'     },
  { name: 'World Wars',     category: 'History'     },
  { name: 'Human Anatomy',  category: 'Biology'     },
  { name: 'Genetics',       category: 'Biology'     },
  { name: 'Ecosystems',     category: 'Biology'     },
  { name: 'Syntax',         category: 'Grammar'     },
  { name: 'Punctuation',    category: 'Grammar'     },
  { name: 'Parts of Speech',category: 'Grammar'     },
];

const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create all tables
    for (const stmt of DDL) {
      await client.query(stmt);
    }

    // Migrations: add columns that may not exist in older installs
    await client.query(
      `ALTER TABLE materials ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL`
    );

    // Remove legacy categories that are no longer part of the academic curriculum.
    // ON DELETE CASCADE on sub_categories and prompts handles child rows automatically.
    const legacyCategories = ['Programming', 'Languages', 'Cooking'];
    for (const name of legacyCategories) {
      await client.query('DELETE FROM categories WHERE name = $1', [name]);
    }
    console.log('🗑️  Legacy categories removed (if they existed)');

    // Seed categories (idempotent via UNIQUE name constraint)
    for (const name of CATEGORY_SEEDS) {
      await client.query(
        'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [name]
      );
    }

    // Seed sub-categories (idempotent via UNIQUE(name, category_id) constraint)
    for (const { name, category } of SUB_CATEGORY_SEEDS) {
      await client.query(
        `INSERT INTO sub_categories (name, category_id)
         SELECT $1, id FROM categories WHERE name = $2
         ON CONFLICT (name, category_id) DO NOTHING`,
        [name, category]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing database:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = initDb;
