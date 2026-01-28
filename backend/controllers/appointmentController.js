const Appointment = require('../models/appointmentModel.js');
const User = require('../models/userModel.js');


// ================= CREATE APPOINTMENT =================
async function createAppointment(req, res) {
  try {
    const { dateTime, doctorId } = req.body;
    const createdBy = req.user && req.user.id;

    if (!createdBy) {
      return res.status(401).send({
        msg: "Unauthorized",
        success: false,
      });
    }

    console.log("Creating appointment:", { dateTime, doctorId, createdBy });

    const newAppointment = await Appointment.create({
      dateTime,
      doctorId,
      createdBy,
    });

    if (!newAppointment) {
      return res.status(400).send({
        msg: "Appointment not created",
        success: false,
      });
    }

    console.log("Appointment created successfully:", newAppointment.id);

    return res.status(200).send({
      msg: "Appointment created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).send({
      msg: "Server Error",
      error: error.message,
    });
  }
}


// ================= STATUS UPDATE BY DOCTOR =================
async function statusUpdateByDoctor(req, res) {
  const { ID } = req.params;
  const { status } = req.body;

  const allowedStatus = ["Pending", "Accepted", "Rejected"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).send({
      msg: "Invalid status value",
      success: false,
    });
  }

  try {
    console.log("Updating appointment status:", ID, status);

    const updatedAppointment = await Appointment.update(
      {
        status,
        updatedBy: req.user.id,
      },
      {
        where: { id: ID },
      }
    );

    if (updatedAppointment[0] === 0) {
      return res.status(400).send({
        msg: "Appointment not updated",
        success: false,
      });
    }

    return res.status(200).send({
      msg: "Appointment status updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return res.status(500).send({
      msg: "Server Error",
      error: error.message,
    });
  }
}


// ================= UPDATE APPOINTMENT =================
function updateAppointment(req, res) {
  try {
    const { ID } = req.params;
    const { dateTime } = req.body;

    Appointment.update(
      { dateTime },
      { where: { id: ID } }
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
    const { ID } = req.params;

    Appointment.destroy({
      where: { id: ID },
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
