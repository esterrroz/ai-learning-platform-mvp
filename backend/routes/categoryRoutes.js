const express = require('express');
const router = express.Router();
const { getCategories, getSubCategories } = require('../controllers/categoryController');

router.get('/',                          getCategories);
router.get('/:categoryId/subcategories', getSubCategories);

module.exports = router;
