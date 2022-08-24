const Sequelize = require('sequelize');
const context = require('../database/context');
const Email = require('./email.model');

const User = context.define('users', {
    id: {
        field: 'id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        field: 'full_name',
        type: Sequelize.STRING
    },
    email: {
        field: 'email',
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

Email.belongsToMany(User, {
    through: "users_sent_emails",
    as: "sentToUsers",
    foreignKey: "email_id",
  });
User.belongsToMany(Email, {
    through: "users_sent_emails",
    as: "sentEmails",
    foreignKey: "user_id",
  });

module.exports = User;