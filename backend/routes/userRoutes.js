const express = require('express');
const UserController = require('../controllers/userController.js');
const { auth } = require('../middleware/auth.js')
const upload = require("../middleware/multer.js")
const router = express.Router();

router.post('/register', upload.single('userImage'), UserController.register);
router.post('/login', UserController.login);
router.get('/getUserInfo', auth, UserController.getUserInfo)
router.get('/userList', auth, UserController.userList)
router.get('/doctorList', auth, UserController.doctorList)
router.put('/updateUser', auth, upload.single('userImage'), UserController.updateUser)

module.exports = router;