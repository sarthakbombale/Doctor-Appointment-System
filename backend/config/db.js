const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        define: {
            timestamps: true
        }
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.log('❌ Error while connecting to database', error);
    }
}

const syncDB = async (force = false, alter = true) => {
    try {
        await sequelize.sync({ force: alter });
        console.log('✅ All models were synchronized successfully');
    } catch (error) {
        console.log('❌ Error syncing models', error);
    }
};

module.exports = {
    sequelize,
    testConnection,
    syncDB
};
