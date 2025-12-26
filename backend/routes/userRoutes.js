const express = require('express');

const UserController = require('../controllers/userController');

const {auth} = require('../middleware/auth')

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/getUserinfo',auth, UserController.getUserInfo)

module.exports = router;