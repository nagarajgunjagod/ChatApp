const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200', // Allow requests from the frontend
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/mean-chat')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use routes
app.use('/auth', authRoutes);
app.use('/api', chatRoutes);
app.use('/api/users', userRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a chat room
  socket.on('join-chat', (chatId) => {
    console.log(`User joined chat room: ${chatId}`);
    socket.join(chatId);
  });

  // Handle sending messages
  socket.on('send-message', (message) => {
    console.log('Message received:', message);
    io.to(message.chatId).emit('receive-message', message); // Broadcast to the chat room
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
