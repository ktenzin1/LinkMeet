const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUser, searchProfessionalsBySkill } = require('.../models/User.js'); // Ensure this path is correct
const router = express.Router();

// Sign Up Route
router.post('/signup', async (req, res) => {
    const { username, email, password, skills } = req.body; // Capture username, email, password, and skills

    // Input validation
    if (!username || !email || !password || !skills) {
        return res.status(400).json({ error: 'Username, email, password, and skills are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(email, hashedPassword); // Store username and hashed password
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
        const user = await getUser(email); // Ensure getUser fetches by email
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
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search Live Professionals by Skill
router.get('/search', async (req, res) => {
    const { skill } = req.query;

    if (!skill) {
        return res.status(400).json({ error: 'Skill is required.' });
    }

    try {
        const professionals = await searchProfessionalsBySkill(skill);
        res.json(professionals);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
