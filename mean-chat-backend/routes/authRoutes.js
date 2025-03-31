const express = require('express');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
 
const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure key

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  console.log('Login attempt:', { username }); // Debugging log

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found'); // Debugging log
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid); // Debugging log

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error('Login error:', err); // Debugging log
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

module.exports = router;