const Appointment = require('../models/appointmentModel.js');
const User = require('../models/userModel.js');


// ================= CREATE APPOINTMENT =================
async function createAppointment(req, res) {
  try {
    const { dateTime, doctorId } = req.body;
    const createdBy = req.user?.id;

    if (!createdBy || !doctorId || !dateTime) {
      return res.status(400).send({
        success: false,
        msg: "Missing required fields",
      });
    }

    console.log("Creating appointment:", {
      patient: createdBy,
      doctorUserId: doctorId,
      dateTime,
    });

    const newAppointment = await Appointment.create({
      dateTime,
      doctorId,      // MUST be User.id
      createdBy,
      status: "Pending",
    });

    return res.status(201).send({
      success: true,
      msg: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).send({
      success: false,
      msg: "Server Error",
    });
  }
}



// ================= STATUS UPDATE BY DOCTOR =================import { updateDoctorStatus } from "../../api/doctorAPI.js";
// ...existing code...import { updateDoctorStatus } from "../../api/doctorAPI.js";
// ...existing code...import { updateDoctorStatus } from "../../api/doctorAPI.js";
// ...existing code...
async function statusUpdateByDoctor(req, res) {
  const { id } = req.params; // Use lowercase 'id'
  const { status } = req.body;

  // Change "Reject" to "Rejected" in this list
  const allowedStatus = ["Pending", "Accepted", "Rejected", "Completed"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).send({
      msg: `Invalid status. Received: ${status}`,
      success: false,
    });
  }

  try {
    const [rowsUpdated] = await Appointment.update(
      { 
        status: status, 
        updatedBy: req.user.id 
      },
      { where: { id: id } } // Ensure 'id' matches the model PK
    );

    if (rowsUpdated === 0) {
      return res.status(404).send({ msg: "No changes made", success: false });
    }

    return res.status(200).send({
      msg: `Appointment is now ${status}`,
      success: true,
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).send({ msg: "Server Error", error: error.message });
  }
}


// ================= UPDATE APPOINTMENT =================
function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const { dateTime } = req.body;

    Appointment.update(
      { dateTime },
      { where: { id } }
    )
      .then((result) => {
        if (result[0] > 0) {
          return res.status(200).send({
            msg: "Appointment updated successfully",
            success: true,
          });
        }

        return res.status(400).send({
          msg: "Appointment not found",
          success: false,
        });
      })
      .catch((error) => {
        console.error("Update appointment error:", error);
        return res.status(500).send({
          msg: "Server Error",
          success: false,
        });
      });
  } catch (error) {
    console.error("Update appointment error:", error);
    res.status(500).send({ msg: "Server Error" });
  }
}


// ================= DELETE APPOINTMENT =================
function deleteAppointment(req, res) {
  try {
    const { id } = req.params;

    Appointment.destroy({
      where: { id },
    })
      .then((result) => {
        if (result > 0) {
          return res.status(200).send({
            msg: "Appointment deleted successfully",
            success: true,
          });
        }

        return res.status(400).send({
          msg: "Appointment not found",
          success: false,
        });
      })
      .catch((error) => {
        console.error("Delete appointment error:", error);
        return res.status(500).send({
          msg: "Server Error",
          success: false,
        });
      });
  } catch (error) {
    console.error("Delete appointment error:", error);
    res.status(500).send({ msg: "Server Error" });
  }
}


// ================= GET APPOINTMENTS BY USER =================
async function getAppointmentsByUser(req, res) {
  try {
    console.log("Fetching appointments for user:", req.user.id);

    const appointments = await Appointment.findAll({
      where: { createdBy: req.user.id },
      include: [
        {
          model: User,
          as: "doctor",
          attributes: ["id", "name", "email", "contactNumber"],
        },
      ],
      order: [["dateTime", "ASC"]],
    });

    console.log("Appointments found:", appointments.length);

    return res.status(200).send({
      success: true,
      appointments,
      msg: appointments.length ? "Appointments fetched" : "No appointments yet",
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).send({
      msg: "Server Error",
      error: error.message,
      success: false,
    });
  }
}


// ================= GET ALL APPOINTMENTS (ADMIN) =================
async function getAllAppointments(req, res) {
  try {
    console.log("Admin fetching all appointments");

    const appointments = await Appointment.findAll({
      include: [
        {
          model: User,
          as: "doctor",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "patient",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["dateTime", "ASC"]],
    });

    return res.status(200).send({
      success: true,
      appointments,
      msg: appointments.length ? "All appointments fetched" : "No appointments found",
    });
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    return res.status(500).send({
      success: false,
      msg: "Failed to fetch appointments",
      error: error.message,
    });
  }
}


// ================= GET APPOINTMENTS OF DOCTOR =================
async function showAppointmentsOfDoctor(req, res) {
  try {
    const doctorId = req.user.id;
    console.log("Fetching appointments for doctor:", doctorId);

    const appointments = await Appointment.findAll({
      where: { doctorId },
      include: [
        {
          model: User,
          as: "patient",
          attributes: ["id", "name", "email", "contactNumber"],
        },
      ],
      order: [["dateTime", "ASC"]],
    });

    console.log("Appointments found:", appointments.length);

    return res.status(200).send({
      success: true,
      appointments,
      msg: appointments.length ? "Appointments fetched" : "No appointments yet",
    });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return res.status(500).send({
      msg: "Server Error",
      error: error.message,
      success: false,
    });
  }
}



// ================= EXPORTS =================
module.exports = {
  createAppointment,
  statusUpdateByDoctor,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByUser,
  showAppointmentsOfDoctor,
  getAllAppointments,
};
