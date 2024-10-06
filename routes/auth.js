// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUser } = require('../models/User.js');
const router = express.Router();

// Sign Up Route
router.post('/signup', async (req, res) => {
    const { username, email, password, skills } = req.body; // Capture username, email, password, and skills

    // Input validation (ensure username, email, and password are provided)
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(username, hashedPassword); // Use username for identification
        res.status(201).json({ message: 'User created!' });
    } catch (error) {
        res.status(400).json({ error: 'User already exists or invalid data' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Capture email and password for login

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await getUser(email); // Assuming you will modify getUser to fetch by email
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Use username for JWT id
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
