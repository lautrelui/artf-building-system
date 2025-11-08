CREATE DATABASE IF NOT EXISTS artf_building;
USE artf_building;

-- Equipment table
CREATE TABLE equipment (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100),
    floor INT NOT NULL,
    room VARCHAR(100) NOT NULL,
    power_consumption INT NOT NULL,
    voltage INT DEFAULT 220,
    connectivity VARCHAR(100),
    protocols JSON,
    installation_date DATE,
    warranty_until DATE,
    status ENUM('Planned', 'Installed', 'Operational', 'Maintenance') DEFAULT 'Planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_floor (floor),
    INDEX idx_type (type),
    INDEX idx_status (status)
);

-- File uploads table
CREATE TABLE files (
    id VARCHAR(36) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100),
    equipment_id VARCHAR(36),
    description TEXT,
    uploaded_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE SET NULL,
    INDEX idx_equipment (equipment_id)
);

-- Chat messages table
CREATE TABLE chat_messages (
    id VARCHAR(36) PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_created (created_at)
);

-- Users table for authentication
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    role ENUM('admin', 'user', 'viewer') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
);

-- Insert sample data
INSERT INTO equipment (id, type, brand, model, floor, room, power_consumption, voltage, protocols, status) VALUES
(UUID(), 'Serveur', 'Dell', 'PowerEdge R750', 3, 'Salle Serveurs A', 800, 220, '["SNMP", "IPMI"]', 'Planned'),
(UUID(), 'Switch', 'Cisco', 'Catalyst 9300', 3, 'Baie Réseau 1', 150, 220, '["SNMP", "SSH"]', 'Planned'),
(UUID(), 'UPS', 'APC', 'Smart-UPS 3000', -1, 'Local Technique', 0, 220, '["SNMP", "MODBUS"]', 'Installed'),
(UUID(), 'CCTV', 'Hikvision', 'DS-2CD2386G2-I', 0, 'Réception', 15, 24, '["ONVIF"]', 'Operational');