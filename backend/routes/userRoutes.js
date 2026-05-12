const express = require('express');
const router = express.Router();
const { registerUser, getUsers, getPrompts, getUserPrompts } = require('../controllers/userController');

router.post('/', registerUser);
router.get('/',  getUsers);
router.get('/prompts', getPrompts);
router.get('/:userId/prompts', getUserPrompts);

module.exports = router;
