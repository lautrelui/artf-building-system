const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Login route
router.post('/login', async (req, res) => {
    console.log('🔐 Login attempt received:', { username: req.body.username, hasPassword: !!req.body.password });

    const { username, password } = req.body;

    if (!username || !password) {
        console.log('❌ Missing username or password');
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        console.log('🔍 Searching for user:', username);
        const [users] = await db.execute(
            'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
            [username]
        );

        console.log('👤 Users found:', users.length);

        if (users.length === 0) {
            console.log('❌ No user found with username:', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        console.log('🔑 Checking password for user:', user.username);
        console.log('📝 Stored hash starts with:', user.password.substring(0, 20));

        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('✅ Password valid:', isValidPassword);

        if (!isValidPassword) {
            console.log('❌ Invalid password for user:', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await db.execute(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        // Store user in session
        req.session.user = {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        };

        res.json({
            success: true,
            user: req.session.user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ success: true });
    });
});

// Check authentication status
router.get('/status', (req, res) => {
    if (req.session.user) {
        res.json({
            authenticated: true,
            user: req.session.user
        });
    } else {
        res.json({ authenticated: false });
    }
});

// Register new user (admin only)
router.post('/register', async (req, res) => {
    // Check if user is admin
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const { username, password, full_name, email, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if username already exists
        const [existing] = await db.execute(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const userId = uuidv4();
        await db.execute(
            'INSERT INTO users (id, username, password, full_name, email, role) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, username, hashedPassword, full_name || null, email || null, role || 'user']
        );

        res.json({
            success: true,
            message: 'User created successfully',
            userId
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
