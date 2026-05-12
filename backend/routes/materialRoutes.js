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

router.post('/extract-pdf',    extractPDF);
router.post('/summarize',      summarize);
router.post('/generateQuiz',   generateQuizFromPrompt);
router.post('/generateLesson', generateLessonFromPrompt);
router.post('/generate-quiz',  generateQuizFromSummaryRoute);

router.get('/',    getAllMaterials);
router.get('/:id', getMaterialById);
router.post('/',   saveMaterial);
router.delete('/:id', deleteMaterial);

router.post('/:id/quiz',          generateQuizForMaterial);
router.post('/:id/generate-quiz', generateAndSaveQuizById);

module.exports = router;
