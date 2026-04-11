const { Appointment, User } = require('../models/index');

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


// ================= STATUS UPDATE BY DOCTOR ================
async function statusUpdateByDoctor(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  // 1. Force everything to Numbers (BIGINT UNSIGNED safety)
  const appointmentId = Number(id);
  const doctorUserId = Number(req.user.id);

  console.log(`Attempting update: Appt ${appointmentId} by Doctor ${doctorUserId} to ${status}`);

  try {
    const [rowsUpdated] = await Appointment.update(
      {
        status: status,
        updatedBy: doctorUserId 
      },
      {
        where: {
          id: appointmentId,
          doctorId: doctorUserId // Ownership check: Must be the doctor assigned
        }
      }
    );

    if (rowsUpdated === 0) {
      // If we reach here, the SQL ran but nothing changed
      return res.status(404).json({
        success: false,
        msg: "Update failed: Either the appointment doesn't exist or you aren't the assigned doctor."
      });
    }

    return res.status(200).json({ 
      success: true, 
      msg: `Status changed to ${status}` 
    });

  } catch (error) {
    // This will catch DB ENUM errors or Foreign Key failures
    console.error("DATABASE UPDATE ERROR:", error.message);
    return res.status(500).json({ 
      success: false, 
      msg: "Database Error: " + error.message 
    });
  }
}


// ================= UPDATE APPOINTMENT =================
function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const { dateTime } = req.body;

    Appointment.update(
      { dateTime },
      { where: { id: parseInt(id) } }
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
      where: { id: parseInt(id) },
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
