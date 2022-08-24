const { Sequelize } = require('sequelize');

const { Logger } = require('../../core');
const { DATABASE_URL } = require('../../config/environment');

const context = new Sequelize(DATABASE_URL, {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: Logger.log
});

context.authenticate()
    .then(() => {
        Logger.log('Database connection has been established successfully.');
    })
    .catch(err => {
        Logger.error(`Unable to connect to the database: ${err.message}`);
    });

module.exports = context;