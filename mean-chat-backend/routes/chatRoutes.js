const express = require('express');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Message = require('../models/messageModel');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure key

// Middleware to authenticate the user
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    console.error('Authorization token is missing.');
    return res.status(401).json({ error: 'Access denied' });
  }

  const tokenValue = token.split(' ')[1]; // Extract the token after "Bearer"
  console.log('Token received:', tokenValue); // Debugging log

  jwt.verify(tokenValue, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Invalid token:', err);
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get all chats for the logged-in user
router.get('/chats', authenticateToken, async (req, res) => {
  console.log('Reached /chats endpoint'); // Debugging log
  try {
    const userId = req.user.id;
    console.log('Fetching chats for user ID:', userId); // Debugging log

    // Fetch chats where the user is a participant
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'username') // Populate participant usernames
      .populate({
        path: 'messages',
        options: { sort: { timestamp: -1 }, limit: 1 }, // Fetch the latest message
      });

    console.log('Fetched chats:', chats); // Debugging log
    res.json(chats);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get messages for a specific chat
router.get('/chats/:chatId', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching messages for chat:', req.params.chatId); // Debugging log

    const chat = await Chat.findById(req.params.chatId).populate({
      path: 'messages',
      populate: { path: 'sender', select: 'username' }, // Populate sender's username
    });

    if (!chat) {
      console.error('Chat not found:', req.params.chatId); // Debugging log
      return res.status(404).json({ error: 'Chat not found' });
    }

    console.log('Fetched messages:', chat.messages); // Debugging log
    res.json(chat.messages);
  } catch (err) {
    console.error('Error fetching messages:', err); // Debugging log
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get all messages between the logged-in user and a contact
router.get('/messages/:contactId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = req.params.contactId;

    if (!contactId) {
      return res.status(400).json({ error: 'Contact ID is required' });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId },
      ],
    }).sort({ timestamp: 1 }); // Sort messages by timestamp

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message in a chat
router.post('/chats/:chatId/messages', authenticateToken, async (req, res) => {
  try {
    console.log('Adding message to chat:', req.params.chatId); // Debugging log

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      console.error('Chat not found:', req.params.chatId); // Debugging log
      return res.status(404).json({ error: 'Chat not found' });
    }

    const receiver = chat.participants.find(participant => participant.toString() !== req.user.id);
    if (!receiver) {
      console.error('Receiver not found in chat participants'); // Debugging log
      return res.status(400).json({ error: 'Receiver not found in chat participants' });
    }

    const message = new Message({
      text,
      sender: req.user.id,
      receiver,
      chatId: req.params.chatId,
    });

    await message.save();
    chat.messages.push(message._id);
    await chat.save();

    console.log('Message added:', message); // Debugging log
    res.json(message);
  } catch (err) {
    console.error('Error adding message:', err); // Debugging log
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Send a message to a contact
router.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { text, receiver } = req.body;
    const sender = req.user.id;

    if (!text || !receiver) {
      return res.status(400).json({ error: 'Message text and receiver are required' });
    }

    // Create a new message
    const message = new Message({
      text,
      sender,
      receiver,
    });

    // Save the message
    await message.save();

    res.json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Create a new chat
router.post('/chats', authenticateToken, async (req, res) => {
  const { participantId } = req.body;

  try {
    console.log('Creating chat with participant:', participantId); // Debugging log

    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required' });
    }

    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, participantId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [req.user.id, participantId],
        messages: [],
      });
      await chat.save();
      console.log('Chat created:', chat); // Debugging log
    } else {
      console.log('Chat already exists:', chat); // Debugging log
    }

    res.status(201).json(chat);
  } catch (err) {
    console.error('Error creating chat:', err); // Debugging log
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

module.exports = router;