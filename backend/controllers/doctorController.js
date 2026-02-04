const Doctor = require("../models/doctorModel.js");
const User = require("../models/userModel.js");

/* ================= APPLY DOCTOR ================= */
const applyDoctor = async (req, res) => {
  try {
    const { specialist, fees } = req.body;
    const createdBy = req.user.id;

    const newDoc = await Doctor.create({
      Specialist: specialist,
      fees,
      createdBy,
      status: "Pending",
    });

    res.status(200).send({
      msg: "Doctor applied successfully",
      success: true,
      data: newDoc,
    });
  } catch (error) {
    console.error("applyDoctor error:", error);
    res.status(500).send({ msg: error.message });
  }
};

/* ================= UPDATE DOCTOR STATUS (ADMIN) ================= */
const docStatus = async (req, res) => {
  try {
    const { DoctorID } = req.params;
    const { status } = req.body;

    const allowedStatus = ["Pending", "Accepted", "Reject"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send({ msg: "Invalid status value", success: false });
    }

    const doctor = await Doctor.findByPk(DoctorID);
    if (!doctor) {
      return res.status(404).send({ msg: "Doctor not found", success: false });
    }

    doctor.status = status;
    doctor.updatedBy = req.user.id;
    await doctor.save();

    if (status === "Accepted") {
      await User.update(
        {
          role: "Doctor",
          doctorApproved: true
        },
        {
          where: { id: doctor.createdBy }
        }
      );
    }

    if (status === "Reject") {
      await User.update(
        {
          role: "User",
          doctorApproved: false
        },
        {
          where: { id: doctor.createdBy }
        }
      );
    }

    res.status(200).send({
      msg: `Doctor application ${status}`,
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("docStatus error:", error);
    res.status(500).send({ msg: "Server Error", error: error.message });
  }
};

/* ================= GET ALL DOCTORS ================= */
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { status: "Accepted" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "contactNumber", "gender", "imagePath"]
        }
      ]
    });

    // Flatten each doctor object
    const formattedDoctors = doctors.map(doc => ({
  doctorId: doc.id,
  name: doc.user?.name || "N/A",
  email: doc.user?.email || "N/A",
  contactNumber: doc.user?.contactNumber || "N/A",
  gender: doc.user?.gender || "N/A",
  specialist: doc.Specialist,
  fees: doc.fees,
  status: doc.status,
}));

    res.status(200).send({
      success: true,
      doctors: formattedDoctors,
    });
  } catch (error) {
    console.error("getAllDoctors error:", error);
    res.status(500).send({ msg: error.message });
  }
};


/* ================= MY APPLICATION ================= */
const getMyDoctorApplication = async (req, res) => {
  try {
    const application = await Doctor.findOne({
      where: { createdBy: req.user.id },
    });

    if (!application) {
      return res.status(404).send({
        msg: "No application found",
        success: false,
      });
    }

    res.status(200).send({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("getMyDoctorApplication error:", error);
    res.status(500).send({ msg: error.message });
  }
};

/* ================= UPDATE DOCTOR ================= */
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialist, fees } = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).send({
        msg: "Doctor not found",
        success: false,
      });
    }

    if (specialist) doctor.Specialist = specialist;
    if (fees) doctor.fees = fees;

    await doctor.save();

    res.status(200).send({
      msg: "Doctor updated successfully",
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("updateDoctor error:", error);
    res.status(500).send({ msg: error.message });
  }
};

/* ================= DELETE DOCTOR ================= */
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).send({
        msg: "Doctor not found",
        success: false,
      });
    }

    await doctor.destroy();

    res.status(200).send({
      msg: "Doctor deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("deleteDoctor error:", error);
    res.status(500).send({ msg: error.message });
  }
};

/* ================= GET PENDING APPLICATIONS ================= */
const getDoctorApplications = async (req, res) => {
  try {
    const applications = await Doctor.findAll({
      where: { status: "Pending" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        }
      ]
      ,
    });

    res.status(200).send({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("getDoctorApplications error:", error);
    res.status(500).send({ msg: error.message });
  }
};

const getApprovedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { status: "Accepted" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        }
      ]
    });

    res.status(200).json({
      success: true,
      doctors
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "Server Error"
    });
  }
};


module.exports = {
  applyDoctor,
  docStatus,
  getAllDoctors,
  getMyDoctorApplication,
  updateDoctor,
  deleteDoctor,
  getDoctorApplications,
  getApprovedDoctors,
};
