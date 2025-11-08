const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const Equipment = require('../models/Equipment');
const moment = require('moment');

// Export equipment to Excel
router.get('/equipment/excel', async (req, res) => {
    try {
        const { floor, type, status } = req.query;
        const filters = {};
        
        if (floor) filters.floor = floor;
        if (type) filters.type = type;
        if (status) filters.status = status;

        const equipment = await Equipment.findAll(filters);

        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Equipment data sheet
        const equipmentData = equipment.map(item => ({
            'Type': item.type,
            'Marque': item.brand,
            'Modèle': item.model,
            'Numéro de Série': item.serial_number,
            'Étage': item.floor,
            'Local/Salle': item.room,
            'Consommation (W)': item.power_consumption,
            'Tension (V)': item.voltage,
            'Connectivité': item.connectivity,
            'Protocoles': item.protocols ? item.protocols.join(', ') : '',
            'Date Installation': item.installation_date ? moment(item.installation_date).format('DD/MM/YYYY') : '',
            'Garantie jusqu\'au': item.warranty_until ? moment(item.warranty_until).format('DD/MM/YYYY') : '',
            'Statut': item.status,
            'Date Création': moment(item.created_at).format('DD/MM/YYYY HH:mm')
        }));

        const equipmentSheet = XLSX.utils.json_to_sheet(equipmentData);
        XLSX.utils.book_append_sheet(workbook, equipmentSheet, 'Équipements');

        // Summary sheet
        const summary = await Equipment.getFloorSummary();
        const summaryData = summary.map(item => ({
            'Étage': item.floor,
            "Nombre d'Équipements": item.total_equipment,
            'Puissance Totale (W)': item.total_power,
            'Types d\'Équipements': JSON.stringify(item.types)
        }));

        const summarySheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé par Étage');

        // Generate buffer
        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set headers
        const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=artf_equipment_${timestamp}.xlsx`);

        res.send(excelBuffer);
    } catch (error) {
        console.error('Excel export error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export equipment to JSON
router.get('/equipment/json', async (req, res) => {
    try {
        const { floor, type, status } = req.query;
        const filters = {};
        
        if (floor) filters.floor = floor;
        if (type) filters.type = type;
        if (status) filters.status = status;

        const equipment = await Equipment.findAll(filters);
        const summary = await Equipment.getFloorSummary();

        const exportData = {
            metadata: {
                exported_at: new Date().toISOString(),
                total_equipment: equipment.length,
                filters: { floor, type, status }
            },
            equipment: equipment,
            summary: summary
        };

        const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=artf_equipment_${timestamp}.json`);
        
        res.json(exportData);
    } catch (error) {
        console.error('JSON export error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;