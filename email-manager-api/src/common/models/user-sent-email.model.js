const Sequelize = require('sequelize');
const context = require('../database/context');

const UserSentEmail = context.define('users_sent_emails', {
    id: {
        field: 'id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        field: 'user_id',
        type: Sequelize.INTEGER
    },
    emailId: {
        field: 'email_id',
        type: Sequelize.INTEGER
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

module.exports = UserSentEmail