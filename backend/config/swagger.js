const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// הגדרות Swagger — מייצר תיעוד OpenAPI 3.0 אוטומטי מה-JSDoc בקבצי הנתיבים
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Learning Platform API',
      version: '1.0.0',
      description: 'פלטפורמת למידה מבוססת AI — סיכום תוכן, יצירת חידונים וניהול חומרי לימוד.',
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: 'פיתוח מקומי' },
    ],
    components: {
      schemas: {
        // סכמת משתמש
        User: {
          type: 'object',
          properties: {
            id:         { type: 'integer' },
            name:       { type: 'string' },
            phone:      { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        // סכמת קטגוריה
        Category: {
          type: 'object',
          properties: {
            id:   { type: 'integer' },
            name: { type: 'string' },
          },
        },
        // סכמת תת-קטגוריה
        SubCategory: {
          type: 'object',
          properties: {
            id:          { type: 'integer' },
            name:        { type: 'string' },
            category_id: { type: 'integer' },
          },
        },
        // סכמת חומר לימוד
        Material: {
          type: 'object',
          properties: {
            id:            { type: 'integer' },
            title:         { type: 'string' },
            original_text: { type: 'string' },
            summary:       { type: 'string' },
            quiz:          { type: 'object' },
            created_at:    { type: 'string', format: 'date-time' },
          },
        },
        // סכמת פרומפט (היסטוריית למידה)
        Prompt: {
          type: 'object',
          properties: {
            id:              { type: 'integer' },
            user_id:         { type: 'integer' },
            category_id:     { type: 'integer' },
            sub_category_id: { type: 'integer' },
            prompt:          { type: 'string' },
            response:        { type: 'string' },
            created_at:      { type: 'string', format: 'date-time' },
          },
        },
        // סכמת שגיאה כללית
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  // סריקת כל קבצי הנתיבים לאיסוף הערות JSDoc
  apis: [path.join(__dirname, '../routes/*.js')],
};

module.exports = swaggerJsdoc(options);
