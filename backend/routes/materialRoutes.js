const express = require('express');
const router = express.Router();
const {
  extractPDF,
  summarize,
  generateQuizFromPrompt,
  generateLessonFromPrompt,
  generateQuizFromSummaryRoute,
  getAllMaterials,
  getMaterialById,
  saveMaterial,
  deleteMaterial,
  generateQuizForMaterial,
  generateAndSaveQuizById,
} = require('../controllers/materialController');

/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: Learning materials — summarize, quiz, and manage content
 */

/**
 * @swagger
 * /api/materials/extract-pdf:
 *   post:
 *     summary: Extract text from an uploaded PDF
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Extracted text
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text: { type: string }
 *       400:
 *         description: Invalid file
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/extract-pdf', extractPDF);

/**
 * @swagger
 * /api/materials/summarize:
 *   post:
 *     summary: Summarize text using AI
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:  { type: string, description: Text to summarize }
 *               title: { type: string, description: Optional title }
 *     responses:
 *       200:
 *         description: AI-generated summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary: { type: string }
 *       500:
 *         description: AI service error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/summarize', summarize);

/**
 * @swagger
 * /api/materials/generateQuiz:
 *   post:
 *     summary: Generate a quiz from a prompt (no saved material required)
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prompt]
 *             properties:
 *               prompt: { type: string }
 *     responses:
 *       200:
 *         description: Generated quiz questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions: { type: array, items: { type: object } }
 */
router.post('/generateQuiz', generateQuizFromPrompt);

/**
 * @swagger
 * /api/materials/generateLesson:
 *   post:
 *     summary: Generate a lesson from a prompt
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, categoryId, subCategoryId, prompt]
 *             properties:
 *               userId:        { type: integer }
 *               categoryId:    { type: integer }
 *               subCategoryId: { type: integer }
 *               prompt:        { type: string }
 *     responses:
 *       200:
 *         description: AI-generated lesson and saved prompt record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response: { type: string }
 *                 promptId: { type: integer }
 */
router.post('/generateLesson', generateLessonFromPrompt);

/**
 * @swagger
 * /api/materials/generate-quiz:
 *   post:
 *     summary: Generate a quiz from a summary text
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [summary]
 *             properties:
 *               summary: { type: string }
 *     responses:
 *       200:
 *         description: Generated quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions: { type: array, items: { type: object } }
 */
router.post('/generate-quiz', generateQuizFromSummaryRoute);

/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: Get all saved materials
 *     tags: [Materials]
 *     responses:
 *       200:
 *         description: List of materials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Material' }
 */
router.get('/', getAllMaterials);

/**
 * @swagger
 * /api/materials/{id}:
 *   get:
 *     summary: Get a single material by ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Material object
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Material' }
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/:id', getMaterialById);

/**
 * @swagger
 * /api/materials:
 *   post:
 *     summary: Save a new material
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, original_text]
 *             properties:
 *               title:         { type: string }
 *               original_text: { type: string }
 *               summary:       { type: string }
 *               quiz:          { type: object }
 *     responses:
 *       201:
 *         description: Saved material
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Material' }
 */
router.post('/', saveMaterial);

/**
 * @swagger
 * /api/materials/{id}:
 *   delete:
 *     summary: Delete a material
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.delete('/:id', deleteMaterial);

/**
 * @swagger
 * /api/materials/{id}/quiz:
 *   post:
 *     summary: Generate a quiz for a saved material (in-memory, not saved)
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Generated quiz questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions: { type: array, items: { type: object } }
 */
router.post('/:id/quiz', generateQuizForMaterial);

/**
 * @swagger
 * /api/materials/{id}/generate-quiz:
 *   post:
 *     summary: Generate and save a quiz for a material
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Quiz generated and saved to the quizzes table
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quizId:    { type: integer }
 *                 questions: { type: array, items: { type: object } }
 */
router.post('/:id/generate-quiz', generateAndSaveQuizById);

module.exports = router;
