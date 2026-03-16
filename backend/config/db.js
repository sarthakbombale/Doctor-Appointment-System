const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        // TiDB Cloud usually uses port 4000, local MySQL uses 3306
        port: process.env.DB_PORT || 3306, 
        dialect: 'mysql',
        logging: false, // Prevents SQL logs from cluttering your Render console
        define: {
            timestamps: true
        },
        // IMPORTANT: SSL must be inside dialectOptions
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Helps avoid certificate mismatch errors in some environments
            }
        }
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Error while connecting to database:', error.message);
    }
}

const syncDB = async (force = false) => {
    try {
        // 'force: true' drops tables, 'alter: true' updates columns
        await sequelize.sync({ force: force });
        console.log('✅ All models were synchronized successfully');
    } catch (error) {
        console.error('❌ Error syncing models:', error.message);
    }
};

module.exports = {
    sequelize,
    testConnection,
    syncDB
};