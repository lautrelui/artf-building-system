const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdn.socket.io"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "ws:", "wss:"]
        }
    }
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'artf-building-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('equipment_update', (data) => {
        // Broadcast equipment updates to all connected clients
        socket.broadcast.emit('equipment_updated', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('io', io);

// Import routes
const indexRoutes = require('./routes/index');
const chatRoutes = require('./routes/chat');
const equipmentRoutes = require('./routes/equipment');
const uploadRoutes = require('./routes/upload');
const exportRoutes = require('./routes/export');

// Use routes
app.use('/', indexRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/export', exportRoutes);

// Prevent copy-paste middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

server.listen(PORT, () => {
    console.log(`ARTF Building System running on port ${PORT}`);
    console.log(`WebSocket server is active`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});