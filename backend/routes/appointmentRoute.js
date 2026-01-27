const express = require('express')
const appointmentController = require('../controllers/appointmentController')
const { auth, doctor,admin } = require('../middleware/auth.js')

const router = express.Router()


router.post('/createAppoint',auth, appointmentController.createAppointment)

router.patch('/statusUpdateByDoctor/:ID',auth, doctor, appointmentController.statusUpdateByDoctor)

router.put('/updateAppoint/:ID', auth ,appointmentController.updateAppointment )

router.delete('/deleteAppoint/:ID', auth, appointmentController.deleteAppointment)

router.get('/getAppointmentsByUser', auth, appointmentController.getAppointmentsByUser)

router.get('/showAppointmentsOfDoctor', auth ,doctor, appointmentController.showAppointmentsOfDoctor) 

router.get(
  '/all',
  auth,
  admin,
  appointmentController.getAllAppointments
);

// get appontments by query 



module.exports = router