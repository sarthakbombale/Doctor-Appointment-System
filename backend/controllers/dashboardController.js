const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");

const adminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: "User" } });
    const totalDoctors = await User.count({ where: { role: "Doctor" } });
    const totalAppointments = await Appointment.count();

    return res.json({
      success: true,
      data: { totalUsers, totalDoctors, totalAppointments },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

const doctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const totalAppointments = await Appointment.count({
      where: { doctorId },
    });

    const totalPatients = await Appointment.count({
      where: { doctorId },
      distinct: true,
      col: "createdBy",
    });

    return res.json({
      success: true,
      data: { totalAppointments, totalPatients },
    });
  } catch (error) {
    console.error("Doctor Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

const userDashboard = async (req, res) => {
  try {
    const totalAppointments = await Appointment.count({
      where: { createdBy: req.user.id },
    });

    return res.json({
      success: true,
      data: { totalAppointments },
    });
  } catch (error) {
    console.error("User Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  adminDashboard,
  doctorDashboard,
  userDashboard,
};