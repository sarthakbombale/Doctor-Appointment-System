const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth.js");
const { register, login, getUserInfo } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/getUserInfo', auth, getUserInfo);

module.exports = router;
