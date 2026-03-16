const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 4000,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Error while connecting to database:', error.message);
    }
};

const syncDB = async (force = false) => {
    try {
        await sequelize.sync({ force });
        console.log('✅ All models were synchronized successfully');
    } catch (error) {
        console.error('❌ Error syncing models:', error.message);
    }
};

module.exports = { sequelize, testConnection, syncDB };