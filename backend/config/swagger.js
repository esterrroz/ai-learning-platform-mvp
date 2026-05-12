const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Learning Platform API',
      version: '1.0.0',
      description: 'AI-powered learning platform — summarize content, generate quizzes, and manage materials.',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local development' },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id:         { type: 'integer' },
            name:       { type: 'string' },
            phone:      { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id:   { type: 'integer' },
            name: { type: 'string' },
          },
        },
        SubCategory: {
          type: 'object',
          properties: {
            id:          { type: 'integer' },
            name:        { type: 'string' },
            category_id: { type: 'integer' },
          },
        },
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
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

module.exports = swaggerJsdoc(options);
