const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class File {
    static async create(fileData) {
        const id = uuidv4();
        const {
            filename, originalName, filePath, fileSize,
            mimeType, equipmentId, description, uploadedBy
        } = fileData;

        const query = `
            INSERT INTO files (id, filename, original_name, file_path, file_size, mime_type, equipment_id, description, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            id, filename, originalName, filePath, fileSize,
            mimeType, equipmentId, description, uploadedBy
        ];

        const [result] = await pool.execute(query, values);
        return { id, ...fileData };
    }

    static async findByEquipmentId(equipmentId) {
        const [rows] = await pool.execute(
            'SELECT * FROM files WHERE equipment_id = ? ORDER BY created_at DESC',
            [equipmentId]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM files WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM files WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = File;