const mongoose = require('mongoose');

// Define the schema for a chat
const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], // Users in the chat
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // References to messages
});

// Create and export the model
const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;