const Sequelize = require('sequelize');
const context = require('../database/context');

const Email = context.define('emails', {
    id: {
        field: 'id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subject: {
        field: 'subject',
        type: Sequelize.STRING
    },
    body: {
        field: 'body',
        type: Sequelize.STRING
    },
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATE
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE
    }
}, {
    timestamps: true,
    underscored: true
});

module.exports = Email;