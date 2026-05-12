-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Sub_Categories table
CREATE TABLE IF NOT EXISTS sub_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE (name, category_id)
);

-- Create Prompts table
CREATE TABLE IF NOT EXISTS prompts (
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
);

-- Create Materials table (for storing summarized texts and generated quizzes)
CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  original_text TEXT NOT NULL,
  summary TEXT,
  quiz JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Quizzes table (for storing AI-generated quiz questions linked to materials)
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data: Initial Categories
INSERT INTO categories (name) VALUES
('Programming')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name) VALUES
('Languages')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name) VALUES
('Cooking')
ON CONFLICT (name) DO NOTHING;

-- Seed Data: Sub-Categories for Programming
INSERT INTO sub_categories (name, category_id) 
SELECT 'JavaScript', id FROM categories WHERE name = 'Programming'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (name, category_id) 
SELECT 'Python', id FROM categories WHERE name = 'Programming'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (name, category_id) 
SELECT 'Web Development', id FROM categories WHERE name = 'Programming'
ON CONFLICT DO NOTHING;

-- Seed Data: Sub-Categories for Languages
INSERT INTO sub_categories (name, category_id) 
SELECT 'English', id FROM categories WHERE name = 'Languages'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (name, category_id) 
SELECT 'Spanish', id FROM categories WHERE name = 'Languages'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (name, category_id) 
SELECT 'French', id FROM categories WHERE name = 'Languages'
ON CONFLICT DO NOTHING;

-- Seed Data: Sub-Categories for Cooking
INSERT INTO sub_categories (name, category_id) 
SELECT 'Italian Cuisine', id FROM categories WHERE name = 'Cooking'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (name, category_id) 
SELECT 'Asian Cuisine', id FROM categories WHERE name = 'Cooking'
ON CONFLICT DO NOTHING;

INSERT INTO sub_categories (name, category_id) 
SELECT 'Baking', id FROM categories WHERE name = 'Cooking'
ON CONFLICT DO NOTHING;
