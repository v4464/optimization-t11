const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./users');

const ChatMessage = sequelize.define('chatMessage', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

User.hasMany(ChatMessage, { foreignKey: 'userId' });
ChatMessage.belongsTo(User, { foreignKey: 'userId' });

module.exports = ChatMessage;