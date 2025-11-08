const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const File = require('../models/File');
const path = require('path');
const fs = require('fs').promises;

// Upload file for equipment
router.post('/equipment/:id', upload.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileData = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            equipmentId: id,
            description: description || '',
            uploadedBy: 'system' // In production, get from session
        };

        const fileRecord = await File.create(fileData);

        res.json({
            success: true,
            message: 'File uploaded successfully',
            file: fileRecord
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get files for equipment
router.get('/equipment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const files = await File.findByEquipmentId(id);
        res.json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Download file
router.get('/download/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const filePath = path.join(__dirname, '../public/uploads', file.filename);
        
        res.download(filePath, file.original_name, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({ error: 'Error downloading file' });
            }
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete file
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Delete physical file
        try {
            await fs.unlink(file.file_path);
        } catch (unlinkError) {
            console.warn('Could not delete physical file:', unlinkError);
        }

        // Delete database record
        await File.delete(id);

        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        console.error('File delete error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;