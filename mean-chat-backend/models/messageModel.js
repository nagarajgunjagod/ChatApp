const mongoose = require('mongoose');

// Define the schema for a message
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender of the message
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Receiver of the message
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true }, // Link to the Chat model
  timestamp: { type: Date, default: Date.now }, // Timestamp of the message
});

// Create and export the model
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;