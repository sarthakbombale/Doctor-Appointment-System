const { Appointment, User } = require('../models/index');

// ================= CREATE APPOINTMENT =================
async function createAppointment(req, res) {
  try {
    const { dateTime, doctorId } = req.body;
    const createdBy = req.user?.id;

    if (!createdBy || !doctorId || !dateTime) {
      return res.status(400).send({ success: false, msg: "Missing required fields" });
    }

    // --- CONFLICT CHECK ---
    const existingAppointment = await Appointment.findOne({
      where: {
        doctorId: doctorId,
        dateTime: dateTime,
        status: ['Pending', 'Accepted']
      }
    });

    if (existingAppointment) {
      return res.status(400).send({
        success: false,
        msg: "This time slot is already booked for this doctor. Please choose another time."
      });
    }

    const newAppointment = await Appointment.create({
      dateTime,
      doctorId,
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
    return res.status(500).send({ success: false, msg: "Server Error" });
  }
}

// ================= STATUS UPDATE BY DOCTOR ================
async function statusUpdateByDoctor(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const doctorUserId = Number(req.user.id);

  try {
    const [rowsUpdated] = await Appointment.update(
      { status, updatedBy: doctorUserId },
      { 
        where: { 
          id: Number(id), 
          doctorId: doctorUserId 
        } 
      }
    );

    if (rowsUpdated === 0) {
      return res.status(404).json({
        success: false,
        msg: "Update failed: Appointment not found or unauthorized."
      });
    }

    return res.status(200).json({ success: true, msg: `Status changed to ${status}` });
  } catch (error) {
    console.error("DATABASE UPDATE ERROR:", error.message);
    return res.status(500).json({ success: false, msg: "Database Error" });
  }
}

// ================= UPDATE APPOINTMENT (USER/ADMIN) =================
async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const { dateTime } = req.body;

    const [rowsUpdated] = await Appointment.update(
      { dateTime },
      { where: { id: parseInt(id) } }
    );

    if (rowsUpdated > 0) {
      return res.status(200).send({
        success: true,
        msg: "Appointment updated successfully",
      });
    }

    return res.status(400).send({
      success: false,
      msg: "Appointment not found",
    });
  } catch (error) {
    console.error("Update appointment error:", error);
    return res.status(500).send({ success: false, msg: "Server Error" });
  }
}

// ================= DELETE APPOINTMENT =================
async function deleteAppointment(req, res) {
  try {
    const { id } = req.params;

    const result = await Appointment.destroy({
      where: { id: parseInt(id) },
    });

    if (result > 0) {
      return res.status(200).send({
        success: true,
        msg: "Appointment deleted successfully",
      });
    }

    return res.status(400).send({
      success: false,
      msg: "Appointment not found",
    });
  } catch (error) {
    console.error("Delete appointment error:", error);
    return res.status(500).send({ success: false, msg: "Server Error" });
  }
}

// ================= GET APPOINTMENTS BY USER =================
async function getAppointmentsByUser(req, res) {
  try {
    const appointments = await Appointment.findAll({
      where: { createdBy: req.user.id },
      include: [{
        model: User,
        as: "doctor",
        attributes: ["id", "name", "email", "contactNumber"],
      }],
      order: [["dateTime", "ASC"]],
    });

    return res.status(200).send({
      success: true,
      appointments,
      msg: appointments.length ? "Appointments fetched" : "No appointments yet",
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).send({ success: false, msg: "Server Error" });
  }
}

// ================= GET ALL APPOINTMENTS (ADMIN) =================
async function getAllAppointments(req, res) {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, as: "doctor", attributes: ["id", "name", "email"] },
        { model: User, as: "patient", attributes: ["id", "name", "email"] },
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
    return res.status(500).send({ success: false, msg: "Failed to fetch appointments" });
  }
}

// ================= GET APPOINTMENTS OF DOCTOR =================
async function showAppointmentsOfDoctor(req, res) {
  try {
    const doctorId = req.user.id;
    const appointments = await Appointment.findAll({
      where: { doctorId },
      include: [{
        model: User,
        as: "patient",
        attributes: ["id", "name", "email", "contactNumber"],
      }],
      order: [["dateTime", "ASC"]],
    });

    return res.status(200).send({
      success: true,
      appointments,
      msg: appointments.length ? "Appointments fetched" : "No appointments yet",
    });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return res.status(500).send({ success: false, msg: "Server Error" });
  }
}

module.exports = {
  createAppointment,
  statusUpdateByDoctor,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByUser,
  showAppointmentsOfDoctor,
  getAllAppointments,
};