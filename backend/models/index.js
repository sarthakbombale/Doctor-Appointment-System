const User = require('./userModel.js');
const Appointment = require('./appointmentModel.js')
const Doctor = require('./doctorModel.js')

//patient appointment
User.hasMany(Appointment, { foreignKey: 'createdBy' })
Appointment.belongsTo(User, { foreignKey: 'createdBy', as: 'patient' })

//Doctor appointment
User.hasMany(Appointment, { foreignKey: 'doctorId' })
Appointment.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' })

//Updated By - User
Appointment.belongsTo(User, { foreignKey: 'updatedBy', as: 'updateByUser' })

//Doctor - User relationship
User.hasMany(Doctor, { foreignKey: 'createdBy' })
Doctor.belongsTo(User, { foreignKey: 'createdBy' })