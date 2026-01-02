const User = require('./userModel.js');
const Appointment = require('./appointmentModel.js')

//patient appointment
User.hasMany(Appointment, { foreignKey: 'createdBy' })
Appointment.belongsTo(User, { foreignKey: 'createdBy', as: 'patient' })

//Doctor appointment
User.hasMany(Appointment, { foreignKey: 'doctorId' })
Appointment.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' })

//Updtaed By - User
Appointment.belongsTo(User, { foreignKey: 'updateBy', as: 'updateByUser' })