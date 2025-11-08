const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

// Get all equipment with optional filters
router.get('/list', async (req, res) => {
    try {
        const { floor, type, status } = req.query;
        const filters = {};
        
        if (floor) filters.floor = floor;
        if (type) filters.type = type;
        if (status) filters.status = status;

        const equipment = await Equipment.findAll(filters);
        res.json(equipment);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add new equipment
router.post('/add', async (req, res) => {
    try {
        const equipment = req.body;
        
        // Basic validation
        const requiredFields = ['type', 'brand', 'floor', 'room', 'powerConsumption'];
        for (const field of requiredFields) {
            if (!equipment[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        const newEquipment = await Equipment.create(equipment);
        
        // Emit WebSocket event for real-time update
        const io = req.app.get('io');
        io.emit('equipment_added', newEquipment);

        res.json({ 
            success: true, 
            message: 'Equipment added successfully',
            equipment: newEquipment 
        });
    } catch (error) {
        console.error('Equipment add error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update equipment
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const equipmentData = req.body;

        const updated = await Equipment.update(id, equipmentData);
        
        if (updated) {
            // Emit WebSocket event
            const io = req.app.get('io');
            io.emit('equipment_updated', { id, ...equipmentData });

            res.json({ success: true, message: 'Equipment updated successfully' });
        } else {
            res.status(404).json({ error: 'Equipment not found' });
        }
    } catch (error) {
        console.error('Equipment update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete equipment
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Equipment.delete(id);
        
        if (deleted) {
            // Emit WebSocket event
            const io = req.app.get('io');
            io.emit('equipment_deleted', { id });

            res.json({ success: true, message: 'Equipment deleted successfully' });
        } else {
            res.status(404).json({ error: 'Equipment not found' });
        }
    } catch (error) {
        console.error('Equipment delete error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get floor summary
router.get('/floors/summary', async (req, res) => {
    try {
        const summary = await Equipment.getFloorSummary();
        res.json(summary);
    } catch (error) {
        console.error('Error fetching floor summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get equipment count
router.get('/count', async (req, res) => {
    try {
        const count = await Equipment.getCount();
        res.json({ count });
    } catch (error) {
        console.error('Error fetching equipment count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;