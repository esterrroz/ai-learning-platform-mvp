const express = require('express');
const router = express.Router();
const { registerUser, getUsers, getPrompts } = require('../controllers/userController');

router.post('/', registerUser);
router.get('/',  getUsers);
router.get('/prompts', getPrompts);

module.exports = router;
