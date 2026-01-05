const express = require('express');
const {auth,admin}=require('../middleware/auth.js');
const doctorController = require('../controllers/doctorController.js');

const router = express.Router();

router.post('/apply',auth,doctorController.applyDoctor)
router.post('/docStatus/:DoctorID',auth,admin,doctorController.docStatus) //update on two tbles 
// router.get('/getDocInfo',doctorController.getDoctorInfo)
// router.patch('/update',doctorController.updateDoctor)
// router.delete('/delete/:ID',doctorController.deleteDoctor)


module.exports= router;
