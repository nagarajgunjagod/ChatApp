const express = require('express');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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

// Search for users by username
router.get('/search', authenticateToken, async (req, res) => {
  const { username } = req.query;
  try {
    const users = await User.find({
      username: { $regex: username, $options: 'i' }, // Case-insensitive search
      _id: { $ne: req.user.id }, // Exclude the logged-in user
    }).select('username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search for users' });
  }
});

module.exports = router;