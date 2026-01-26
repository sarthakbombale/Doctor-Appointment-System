const Appointment = require('../models/appointmentModel.js');
const User = require('../models/userModel.js');


async function createAppointment(req, res) {
    try {
        const { dateTime, doctorId } = req.body
        const createdBy = req.user && req.user.id

        if (!createdBy) {
            return res.status(401).send({ msg: "Unauthorized", success: false })
        }

        const newAppointment = await Appointment.create({ dateTime, doctorId, createdBy })
        if (!newAppointment) {
            return res.status(400).send({ msg: "Appointment not created", success: false })
        }
        return res.status(200).send({ msg: "Appointment created successfully", success: true })
    } catch (error) {
        return res.status(500).send({ msg: "Server Error" })
    }
}

async function statusUpdateByDoctor(req, res) {
    const { ID } = req.params;
    console.log(ID, "________id_______");
    try {
        const updatedAppointment = await Appointment.update(
            {
                status: req.body.status,
                updatedBy: req.user.id,
            },
            {
                where: { id: ID },
            }
        );
        console.log(updatedAppointment, "updatedAppointment");
        if (updatedAppointment.length == 0) {
            res.status(200).send({ msg: "appointment not updated", success: false });
        }
        res
            .status(200)
            .send({ msg: "appointments status updated successfully", success: true });
    } catch (error) {
        res.status(500).send({ msg: "Server Error" });
    }
}

function updateAppointment(req, res) {
    try {
        const { ID } = req.params;
        const { dateTime } = req.body;
        
        Appointment.update(
            { dateTime },
            { where: { id: ID } }
        ).then(result => {
            if(result[0] > 0) {
                return res.status(200).send({ msg: "Appointment updated successfully", success: true });
            }
            return res.status(400).send({ msg: "Appointment not found", success: false });
        }).catch(error => {
            return res.status(500).send({ msg: "Server Error", success: false });
        });
    } catch (error) {
        res.status(500).send({ msg: "Server Error" })
    }
}


function deleteAppointment(req, res) {
    try {
        const { ID } = req.params;
        Appointment.destroy({
            where: { id: ID }
        }).then(result => {
            if(result > 0) {
                return res.status(200).send({ msg: "Appointment deleted successfully", success: true });
            }
            return res.status(400).send({ msg: "Appointment not found", success: false });
        }).catch(error => {
            return res.status(500).send({ msg: "Server Error", success: false });
        });
    } catch (error) {
        res.status(500).send({ msg: "Server Error" })
    }
}

async function getAppointmentsByUser(req, res) {
    try {
        const appointments = await Appointment.findAll({
            where: { createdBy: req.user.id },
            include: [
                { model: User, as: 'doctor', attributes: ['id', 'name'] }
            ],
            order: [['dateTime', 'ASC']]
        });

        return res.status(200).send({
            success: true,
            appointments: appointments,
            msg: appointments.length ? "Appointments fetched" : "No appointments yet"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Server Error", success: false });
    }
}



function showAppointmentsOfDoctor(req, res) {
    try {
        const doctorId = req.user.id;
        Appointment.findAll({
            where: { doctorId },
            include: [
                { model: User, as: 'patient', attributes: ['id', 'name', 'email', 'contactNumber'] }
            ],
            order: [['dateTime', 'ASC']]
        }).then(appointments => {
            return res.status(200).send({
                success: true,
                appointments: appointments,
                msg: appointments.length ? "Appointments fetched" : "No appointments yet"
            });
        }).catch(error => {
            return res.status(500).send({ msg: "Server Error", success: false });
        });
    } catch (error) {
        return res.status(500).send({ msg: "Server Error", success: false });
    }
}


module.exports = { createAppointment, statusUpdateByDoctor, updateAppointment, deleteAppointment, getAppointmentsByUser, showAppointmentsOfDoctor, }