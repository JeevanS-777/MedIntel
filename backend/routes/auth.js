const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Structural payload verification
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required registration fields (name, email, password).' });
    }

    try {
        // 2. Check if user already exists to prevent duplicate key constraint violations
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'A user account with this email address already exists.' });
        }

        // 3. Securely hash the plain-text password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Save into local MySQL 'users' table architecture
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // 5. Build signed session validation token
        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(201).json({
            message: 'User account created successfully.',
            token,
            user: { id: result.insertId, name, email }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal system fault during user registration.', details: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & return validation token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password parameters.' });
    }

    try {
        // 1. Fetch user validation footprints by unique index
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid authentication credentials provided.' });
        }

        const user = users[0];

        // 2. Cross-verify crytographic password matching signatures
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid authentication credentials provided.' });
        }

        // 3. Issue new operational runtime signature JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            message: 'Authentication successful.',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal system fault during authentication routing.', details: error.message });
    }
});

module.exports = router;