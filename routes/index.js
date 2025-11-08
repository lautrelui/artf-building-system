const express = require('express');
const router = express.Router();
const path = require('path');
const documentData = require('../data/document-data');

// Serve main page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API endpoint to get all document sections
router.get('/api/document/sections', (req, res) => {
    try {
        const sections = documentData.getSections();
        res.json(sections);
    } catch (error) {
        console.error('Error fetching sections:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to get specific section
router.get('/api/document/section/:id', (req, res) => {
    try {
        const section = documentData.getSection(req.params.id);
        if (section) {
            res.json(section);
        } else {
            res.status(404).json({ error: 'Section not found' });
        }
    } catch (error) {
        console.error('Error fetching section:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'ARTF Building System'
    });
});

module.exports = router;