const express = require('express');
const UserController = require('../controllers/userController.js');
const { auth } = require('../middleware/auth.js')
const upload = require("../middleware/multer.js")
const router = express.Router();

router.post('/register', upload.single('userImage'), UserController.register);
router.post('/login', UserController.login);
router.get('/getUserinfo', auth, UserController.getUserInfo)
router.get('/doctorList', auth, UserController.doctorList)
// router.put('/uploadUser',auth,upload,UserController.updateUser)

module.exports = router;