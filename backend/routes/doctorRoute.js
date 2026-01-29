const express = require('express');
const {auth,admin}=require('../middleware/auth.js');
const doctorController = require('../controllers/doctorController.js');

const router = express.Router();

router.post('/apply',auth,doctorController.applyDoctor);
router.post('/docStatus/:DoctorID',auth,admin,doctorController.docStatus);
router.get('/applications', auth, admin, doctorController.getDoctorApplications);
router.get('/admin/all-doctors', auth, admin, doctorController.getAllDoctors);
router.get('/my-application', auth, doctorController.getMyDoctorApplication);
router.get('/approved-doctors', auth, doctorController.getApprovedDoctors);
router.patch('/update/:id', auth, doctorController.updateDoctor);
router.delete('/delete/:id', auth, doctorController.deleteDoctor);

module.exports= router;
