const Appointment = require('../models/appointmentModel.js');

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
        res.status(200).send({ msg: "Appointment status updated  successfully" })
    } catch (error) {
        res.status(500).send({ msg: "Server Error" })
    }
}


function deleteAppointment(req, res) {
    try {
        res.status(200).send({ msg: "Appointment deleted successfully" })
    } catch (error) {
        res.status(500).send({ msg: "Server Error" })
    }
}

async function getAppointmentsByUser(req, res) {
    try {
        const appointments = await Appointment.findAll({
            where: { createdBy: req.user.id },
        });
        if (appointments.length == 0) {
            res.status(400).send({ msg: "No appointments yet" });
        }
        res.status(200).send({ appointments: appointments, success: true });
    } catch (error) {
        res.status(500).send({ msg: "Server Error" });
    }
}


function showAppointmentsOfDoctor(req, res) {
    try {
        res.status(200).send({ msg: "Appointment successfully" })
    } catch (error) {
        res.status(500).send({ msg: "Server Error" })
    }
}


module.exports = { createAppointment, statusUpdateByDoctor, updateAppointment, deleteAppointment, getAppointmentsByUser, showAppointmentsOfDoctor, }