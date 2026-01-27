const Doctor = require("../models/doctorModel.js");
const User = require("../models/userModel.js");

const applyDoctor = async(req,res)=>{
    try{
        const{specialist,fees} = req.body
        const createdBy = req.user.id
        console.log(req.body, createdBy,"********")
        const newDoc = await Doctor.create({Specialist: specialist, fees, createdBy})
        console.log(newDoc,"&&&&&&&&&&&&&&newDoc")
        if(newDoc){
            res
      .status(200)
      .send({ msg: "doctor applied successfully", success: true });
        }else{
             res
      .status(200)
      .send({ msg: "doctor not applied successfully", success: false });
        }
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}


const docStatus = async(req,res)=>{
    try{
        //admin req.user.id
        // DoctorID = req.params.DoctorID   Doctor model
    //     Doctor model status ->accepted
    //    if status is accepted -> createdBy  = userID   -> role ->doctor

    const DoctorID = req.params.DoctorID
    console.log(req.user.id,"admin", req.params.DoctorID,"DoctorID")
    const getDoctor = await Doctor.findByPk(DoctorID)
    console.log(getDoctor)
    if(!getDoctor){
        res.status(400).send({msg:"Doctor not found", success:true})
    }else{
         // 2️⃣ Update doctor status
    getDoctor.status = req.body.status;
    await getDoctor.save(); //
        if(getDoctor.status == 'Accepted'){
            await User.update({role:"Doctor"},{where:{id:getDoctor.createdBy}} )
                     res
      .status(200)
      .send({ msg: "doctor applied successfully", success: true });
        }else{
          res
      .status(200)
      .send({ msg: "doctor applied rejected", success: false });
        }


    }

  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

const getDoctorInfo = (req,res)=>{
    try{
            res
      .status(200)
      .send({ msg: "doctor created successfully", success: true });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email', 'contactNumber', 'imagePath'] }
            ]
        });

        if (doctors && doctors.length > 0) {
            // Flatten the nested user data
            const doctorsList = doctors.map(doc => ({
                doctorId: doc.id,
                specialist: doc.Specialist,
                fees: doc.fees,
                status: doc.status,
                name: doc.User ? doc.User.name : '',
                email: doc.User ? doc.User.email : '',
                contactNumber: doc.User ? doc.User.contactNumber : '',
                imagePath: doc.User ? doc.User.imagePath : ''
            }));
            res.status(200).send({ success: true, doctors: doctorsList });
        } else {
            res.status(400).send({ msg: "No doctors found", success: false, doctors: [] });
        }
    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
}

const getMyDoctorApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const application = await Doctor.findOne({
            where: { createdBy: userId }
        });

        if (application) {
            res.status(200).send({ success: true, data: application });
        } else {
            res.status(400).send({ msg: "No application found", success: false });
        }
    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
}

const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { specialist, fees } = req.body;

        const doctor = await Doctor.findByPk(id);

        if (!doctor) {
            return res.status(400).send({ msg: "Doctor not found", success: false });
        }

        if (specialist) doctor.Specialist = specialist;
        if (fees) doctor.fees = fees;

        await doctor.save();

        res.status(200).send({ msg: "Doctor updated successfully", success: true });
    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
}

const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await Doctor.findByPk(id);

        if (!doctor) {
            return res.status(400).send({ msg: "Doctor not found", success: false });
        }

        await doctor.destroy();

        res.status(200).send({ msg: "Doctor deleted successfully", success: true });
    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
}

const getDoctorApplications = async(req,res)=>{
    try{
        const applications = await Doctor.findAll({
            where: { status: 'Pending' },
            include: [
                { model: User, attributes: ['id', 'name', 'email'] }
            ]
        })
        if(applications){
            res.status(200).send({ success: true, data: applications });
        }else{
            res.status(400).send({msg:"No applications found", success:false})
        }
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
}

module.exports = {applyDoctor, docStatus, getDoctorInfo, getAllDoctors, getMyDoctorApplication, updateDoctor, deleteDoctor, getDoctorApplications}