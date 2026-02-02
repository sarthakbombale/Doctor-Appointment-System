const User = require('./userModel.js');
const Appointment = require('./appointmentModel.js')
const Doctor = require('./doctorModel.js')

// Patient appointments
User.hasMany(Appointment, {
  foreignKey: 'createdBy',
  as: 'patientAppointments'
});
Appointment.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'patient'
});

// Doctor appointments
User.hasMany(Appointment, {
  foreignKey: 'doctorId',
  as: 'doctorAppointments'
});
Appointment.belongsTo(User, {
  foreignKey: 'doctorId',
  as: 'doctor'
});


//Updated By - User
Appointment.belongsTo(User, { foreignKey: 'updatedBy', as: 'updateByUser' })



// Doctor → belongs to User
Doctor.belongsTo(User, {
  foreignKey: "createdBy",
  as: "user"
});

// User → has one Doctor profile
User.hasOne(Doctor, {
  foreignKey: "createdBy",
  as: "doctorProfile"
});

module.exports = {
  User,
  Doctor
};