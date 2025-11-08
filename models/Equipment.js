// models/Equipment.js
const mysql = require('mysql2/promise');
require('dotenv').config();

class Equipment {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'mysql',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'artf_user',
            password: process.env.DB_PASSWORD || 'artf_password',
            database: process.env.DB_NAME || 'artf_building',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    // Get all equipment with optional filters
    async findAll(filters = {}) {
        try {
            let query = `SELECT * FROM equipment WHERE 1=1`;
            const params = [];

            if (filters.floor) {
                query += ` AND floor = ?`;
                params.push(filters.floor);
            }

            if (filters.type) {
                query += ` AND type = ?`;
                params.push(filters.type);
            }

            if (filters.status) {
                query += ` AND status = ?`;
                params.push(filters.status);
            }

            query += ` ORDER BY created_at DESC`;

            const [rows] = await this.pool.execute(query, params);
            return rows;
        } catch (error) {
            console.error('Error in Equipment.findAll:', error);
            throw error;
        }
    }

    // Get equipment count
    async getCount() {
        try {
            const [rows] = await this.pool.execute('SELECT COUNT(*) as count FROM equipment');
            return rows[0].count;
        } catch (error) {
            console.error('Error in Equipment.getCount:', error);
            throw error;
        }
    }

    // Get floor summary
    async getFloorSummary() {
        try {
            const query = `
                SELECT 
                    floor,
                    COUNT(*) as total_equipment,
                    SUM(power_consumption) as total_power,
                    JSON_ARRAYAGG(DISTINCT type) as types
                FROM equipment 
                GROUP BY floor 
                ORDER BY floor
            `;
            const [rows] = await this.pool.execute(query);
            return rows;
        } catch (error) {
            console.error('Error in Equipment.getFloorSummary:', error);
            throw error;
        }
    }

    // Create new equipment
    async create(equipmentData) {
        try {
            const { v4: uuidv4 } = require('uuid');
            const id = uuidv4();
            
            const query = `
                INSERT INTO equipment 
                (id, type, brand, model, serial_number, floor, room, power_consumption, voltage, connectivity, protocols, installation_date, warranty_until, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                id,
                equipmentData.type,
                equipmentData.brand,
                equipmentData.model || '',
                equipmentData.serial_number || '',
                equipmentData.floor,
                equipmentData.room,
                equipmentData.powerConsumption || equipmentData.power_consumption,
                equipmentData.voltage || 220,
                equipmentData.connectivity || '',
                equipmentData.protocols ? JSON.stringify(equipmentData.protocols) : null,
                equipmentData.installation_date || null,
                equipmentData.warranty_until || null,
                equipmentData.status || 'Planned'
            ];

            await this.pool.execute(query, params);
            
            // Return the created equipment
            const [newEquipment] = await this.pool.execute('SELECT * FROM equipment WHERE id = ?', [id]);
            return newEquipment[0];
        } catch (error) {
            console.error('Error in Equipment.create:', error);
            throw error;
        }
    }

    // Update equipment
    async update(id, equipmentData) {
        try {
            const query = `
                UPDATE equipment 
                SET type = ?, brand = ?, model = ?, serial_number = ?, floor = ?, room = ?, 
                    power_consumption = ?, voltage = ?, connectivity = ?, protocols = ?, 
                    installation_date = ?, warranty_until = ?, status = ?
                WHERE id = ?
            `;
            
            const params = [
                equipmentData.type,
                equipmentData.brand,
                equipmentData.model || '',
                equipmentData.serial_number || '',
                equipmentData.floor,
                equipmentData.room,
                equipmentData.powerConsumption || equipmentData.power_consumption,
                equipmentData.voltage || 220,
                equipmentData.connectivity || '',
                equipmentData.protocols ? JSON.stringify(equipmentData.protocols) : null,
                equipmentData.installation_date || null,
                equipmentData.warranty_until || null,
                equipmentData.status || 'Planned',
                id
            ];

            const [result] = await this.pool.execute(query, params);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in Equipment.update:', error);
            throw error;
        }
    }

    // Delete equipment
    async delete(id) {
        try {
            const [result] = await this.pool.execute('DELETE FROM equipment WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in Equipment.delete:', error);
            throw error;
        }
    }

    // Get equipment by ID
    async findById(id) {
        try {
            const [rows] = await this.pool.execute('SELECT * FROM equipment WHERE id = ?', [id]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error in Equipment.findById:', error);
            throw error;
        }
    }

    // Get unique values for filters
    async getFilterOptions() {
        try {
            const [floors] = await this.pool.execute('SELECT DISTINCT floor FROM equipment ORDER BY floor');
            const [types] = await this.pool.execute('SELECT DISTINCT type FROM equipment ORDER BY type');
            const [statuses] = await this.pool.execute('SELECT DISTINCT status FROM equipment ORDER BY status');
            
            return {
                floors: floors.map(row => row.floor),
                types: types.map(row => row.type),
                statuses: statuses.map(row => row.status)
            };
        } catch (error) {
            console.error('Error in Equipment.getFilterOptions:', error);
            throw error;
        }
    }
}

module.exports = new Equipment();