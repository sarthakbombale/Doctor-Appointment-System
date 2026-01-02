const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize')

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },

  createdBy: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },

  doctorId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },

  dateTime: {
    type: DataTypes.DATE,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(
      'Pending',
      'Accepted',
      'Completed',
      'Reject'
    ),
    defaultValue: 'Pending'
  },

  updatedBy: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }

}, {
  timestamps: true,
  tableName: 'Appointments'
})

module.exports = Appointment