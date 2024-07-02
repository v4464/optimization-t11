const ChatMessage = require('../models/chatMessage');
const User = require('../models/users');
const Sequelize = require('sequelize');

const postMessage = async (req, res) => {
    try {
        const { message } = req.body;

        if (!req.user) {
            return res.status(400).json({ message: 'User not authenticated' });
        }
        const userId = req.user.id; // Assuming authenticate middleware sets req.user

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Message content cannot be empty' });
        }

        // Create a new message
        const newMessage = await ChatMessage.create({ content: message, userId });

        if (newMessage) {
            return res.status(201).json({ message: 'Message sent successfully', newMessage });
        } else {
            return res.status(500).json({ message: 'Failed to send message' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};


const getMessages = async (req, res) => {
    try {
        const { lastMessageId } = req.query;
        const whereClause = lastMessageId ? { id: { [Sequelize.Op.gt]: lastMessageId } } : {};
        const messages = await ChatMessage.findAll({
            where: whereClause,
            include: [{ model: User, attributes: ['name'] }],
            order: [['createdAt', 'ASC']]
        });
        res.status(200).json({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err });
    }
};

module.exports = {
    postMessage,
    getMessages
};