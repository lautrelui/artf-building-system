const express = require('express');
const router = express.Router();
const { getSections, getSection } = require('../data/document-data');

// Get all document sections (for navigation)
router.get('/sections', (req, res) => {
    try {
        const sections = getSections();
        res.json(sections);
    } catch (error) {
        console.error('Error fetching sections:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get specific section by ID
router.get('/section/:id', (req, res) => {
    try {
        const { id } = req.params;
        const section = getSection(id);

        if (!section) {
            return res.status(404).json({ error: 'Section not found' });
        }

        res.json(section);
    } catch (error) {
        console.error('Error fetching section:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search documentation
router.get('/search', (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query required' });
        }

        const allSections = Object.values(require('../data/document-data'));
        const results = [];

        allSections.forEach(section => {
            if (section.title?.toLowerCase().includes(q.toLowerCase()) ||
                section.content?.toLowerCase().includes(q.toLowerCase())) {
                results.push({
                    id: section.id,
                    title: section.title,
                    excerpt: section.content?.substring(0, 200) + '...'
                });
            }

            // Search in subsections
            section.subsections?.forEach(sub => {
                if (sub.title?.toLowerCase().includes(q.toLowerCase()) ||
                    sub.content?.toLowerCase().includes(q.toLowerCase())) {
                    results.push({
                        id: section.id,
                        title: `${section.title} > ${sub.title}`,
                        excerpt: sub.content?.substring(0, 200) + '...'
                    });
                }
            });
        });

        res.json(results);
    } catch (error) {
        console.error('Error searching documentation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
