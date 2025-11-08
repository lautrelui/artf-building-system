-- Sample data for ARTF Building System
-- This script populates the database with sample equipment for testing

USE artf_building;

-- Clear existing data (optional)
-- DELETE FROM files;
-- DELETE FROM equipment;

-- Insert sample equipment for NOC/Data Center (3rd floor)
INSERT INTO equipment (id, type, brand, model, serial_number, floor, room, power_consumption, voltage, connectivity, protocols, installation_date, warranty_until, status) VALUES
-- Servers
(UUID(), 'Serveur', 'Dell', 'PowerEdge R740', 'SRV001-DC-001', 3, 'NOC-DC-R1-U01', 750, 220, 'Dual 10GbE', '["SNMP", "IPMI"]', '2024-01-15', '2027-01-15', 'Operational'),
(UUID(), 'Serveur', 'HPE', 'ProLiant DL380 Gen11', 'SRV002-DC-002', 3, 'NOC-DC-R1-U05', 800, 220, 'Dual 10GbE', '["SNMP", "IPMI"]', '2024-01-20', '2027-01-20', 'Operational'),
(UUID(), 'Serveur', 'Dell', 'PowerEdge R640', 'SRV003-DC-003', 3, 'NOC-DC-R2-U01', 650, 220, 'Dual 10GbE', '["SNMP", "IPMI"]', '2024-02-01', '2027-02-01', 'Operational'),

-- Network Equipment
(UUID(), 'Switch', 'Cisco', 'Catalyst 9300-48UXM', 'SW001-CORE-001', 3, 'NOC-DC-R1-U20', 350, 220, 'Stackable', '["SNMP", "NETCONF"]', '2024-01-10', '2029-01-10', 'Operational'),
(UUID(), 'Switch', 'Cisco', 'Catalyst 9300-48UXM', 'SW002-CORE-002', 3, 'NOC-DC-R1-U21', 350, 220, 'Stackable', '["SNMP", "NETCONF"]', '2024-01-10', '2029-01-10', 'Operational'),
(UUID(), 'Switch', 'Aruba', 'CX 6300M 48G', 'SW003-ACCESS-001', 3, 'NOC-DC-R2-U15', 280, 220, 'PoE+', '["SNMP"]', '2024-02-05', '2029-02-05', 'Operational'),

-- UPS Systems
(UUID(), 'UPS', 'APC', 'Smart-UPS SRT 10kVA', 'UPS001-A', 3, 'NOC-DC-PWR-A', 500, 220, 'Network Card', '["SNMP", "Modbus"]', '2023-12-15', '2028-12-15', 'Operational'),
(UUID(), 'UPS', 'APC', 'Smart-UPS SRT 10kVA', 'UPS002-B', 3, 'NOC-DC-PWR-B', 500, 220, 'Network Card', '["SNMP", "Modbus"]', '2023-12-15', '2028-12-15', 'Operational'),

-- PDU
(UUID(), 'PDU', 'Raritan', 'PX3-5190V', 'PDU001-R1-A', 3, 'NOC-DC-R1', 0, 220, 'Ethernet', '["SNMP"]', '2024-01-05', '2029-01-05', 'Operational'),
(UUID(), 'PDU', 'Raritan', 'PX3-5190V', 'PDU002-R1-B', 3, 'NOC-DC-R1', 0, 220, 'Ethernet', '["SNMP"]', '2024-01-05', '2029-01-05', 'Operational'),
(UUID(), 'PDU', 'Raritan', 'PX3-5190V', 'PDU003-R2-A', 3, 'NOC-DC-R2', 0, 220, 'Ethernet', '["SNMP"]', '2024-01-05', '2029-01-05', 'Operational'),

-- Climate Control
(UUID(), 'Climate', 'Vertiv', 'Liebert PCW', 'AC001-DC-001', 3, 'NOC-DC-HVAC-1', 5500, 380, 'BACnet/IP', '["BACnet", "MODBUS"]', '2023-11-20', '2028-11-20', 'Operational'),
(UUID(), 'Climate', 'Vertiv', 'Liebert PCW', 'AC002-DC-002', 3, 'NOC-DC-HVAC-2', 5500, 380, 'BACnet/IP', '["BACnet", "MODBUS"]', '2023-11-20', '2028-11-20', 'Operational'),

-- Security Cameras (3rd floor)
(UUID(), 'CCTV', 'Axis', 'P3245-LVE', 'CAM001-NOC-001', 3, 'NOC-Entrance', 12, 220, 'PoE', '["ONVIF"]', '2024-01-25', '2027-01-25', 'Operational'),
(UUID(), 'CCTV', 'Axis', 'P3245-LVE', 'CAM002-DC-001', 3, 'NOC-DC-Main', 12, 220, 'PoE', '["ONVIF"]', '2024-01-25', '2027-01-25', 'Operational'),

-- IoT Sensors (3rd floor)
(UUID(), 'Capteur', 'Akcp', 'sensorProbe8-X60', 'SENSOR001-DC-TEMP', 3, 'NOC-DC-R1', 15, 220, 'Ethernet', '["SNMP", "MQTT"]', '2024-02-10', '2027-02-10', 'Operational'),
(UUID(), 'Capteur', 'Akcp', 'sensorProbe8-X60', 'SENSOR002-DC-HUM', 3, 'NOC-DC-R2', 15, 220, 'Ethernet', '["SNMP", "MQTT"]', '2024-02-10', '2027-02-10', 'Operational'),

-- Basement equipment
(UUID(), 'UPS', 'Eaton', '9395 550kVA', 'UPS-MAIN-001', -1, 'Technical Room 1', 5000, 380, 'Network Card', '["SNMP", "MODBUS"]', '2023-10-15', '2033-10-15', 'Operational'),
(UUID(), 'Switch', 'Cisco', 'Catalyst 2960-X', 'SW-BASEMENT-001', -1, 'Technical Room 2', 120, 220, 'Managed', '["SNMP"]', '2024-03-01', '2029-03-01', 'Installed'),

-- Ground floor equipment
(UUID(), 'CCTV', 'Hikvision', 'DS-2CD2385G1-I', 'CAM-RDC-001', 0, 'Main Entrance', 12, 220, 'PoE', '["ONVIF"]', '2024-01-30', '2027-01-30', 'Operational'),
(UUID(), 'CCTV', 'Hikvision', 'DS-2CD2385G1-I', 'CAM-RDC-002', 0, 'Reception', 12, 220, 'PoE', '["ONVIF"]', '2024-01-30', '2027-01-30', 'Operational'),
(UUID(), 'Switch', 'Cisco', 'Catalyst 2960-X', 'SW-RDC-001', 0, 'IT Closet', 120, 220, 'PoE', '["SNMP"]', '2024-02-15', '2029-02-15', 'Operational'),
(UUID(), 'Automate', 'Schneider Electric', 'Modicon M580', 'PLC-RDC-HVAC', 0, 'BMS Room', 45, 220, 'Ethernet', '["MODBUS", "BACnet"]', '2024-03-10', '2029-03-10', 'Operational'),

-- 1st Floor equipment
(UUID(), 'Switch', 'Cisco', 'Catalyst 2960-X', 'SW-F1-001', 1, 'IT Closet', 120, 220, 'PoE', '["SNMP"]', '2024-02-15', '2029-02-15', 'Operational'),
(UUID(), 'CCTV', 'Hikvision', 'DS-2CD2385G1-I', 'CAM-F1-001', 1, 'Corridor', 12, 220, 'PoE', '["ONVIF"]', '2024-01-30', '2027-01-30', 'Operational'),
(UUID(), 'Capteur', 'Akcp', 'sensorProbe2', 'SENSOR-F1-TEMP', 1, 'Server Room', 10, 220, 'Ethernet', '["SNMP"]', '2024-02-10', '2027-02-10', 'Operational'),

-- 2nd Floor equipment
(UUID(), 'Switch', 'Cisco', 'Catalyst 2960-X', 'SW-F2-001', 2, 'IT Closet', 120, 220, 'PoE', '["SNMP"]', '2024-02-15', '2029-02-15', 'Operational'),
(UUID(), 'CCTV', 'Axis', 'P3245-LVE', 'CAM-F2-001', 2, 'Conference Room', 12, 220, 'PoE', '["ONVIF"]', '2024-01-25', '2027-01-25', 'Operational'),
(UUID(), 'Climate', 'Daikin', 'VRV Mini', 'AC-F2-001', 2, 'HVAC Room', 3500, 220, 'BACnet/IP', '["BACnet"]', '2023-12-01', '2028-12-01', 'Operational'),

-- 4th Floor equipment
(UUID(), 'Switch', 'Aruba', 'CX 6200F', 'SW-F4-001', 4, 'IT Closet', 95, 220, 'Managed', '["SNMP"]', '2024-02-20', '2029-02-20', 'Operational'),
(UUID(), 'CCTV', 'Hikvision', 'DS-2CD2385G1-I', 'CAM-F4-001', 4, 'Open Space', 12, 220, 'PoE', '["ONVIF"]', '2024-01-30', '2027-01-30', 'Operational'),
(UUID(), 'Capteur', 'Akcp', 'sensorProbe2', 'SENSOR-F4-ENV', 4, 'Office Area', 10, 220, 'Ethernet', '["SNMP", "MQTT"]', '2024-02-10', '2027-02-10', 'Operational'),

-- 5th Floor equipment
(UUID(), 'Switch', 'Cisco', 'Catalyst 2960-X', 'SW-F5-001', 5, 'IT Closet', 120, 220, 'PoE', '["SNMP"]', '2024-02-15', '2029-02-15', 'Operational'),
(UUID(), 'CCTV', 'Axis', 'P3245-LVE', 'CAM-F5-001', 5, 'Executive Area', 12, 220, 'PoE', '["ONVIF"]', '2024-01-25', '2027-01-25', 'Operational'),
(UUID(), 'Automate', 'Siemens', 'LOGO! 8', 'PLC-F5-LIGHT', 5, 'Control Room', 25, 220, 'Ethernet', '["MODBUS"]', '2024-03-05', '2029-03-05', 'Operational'),

-- 6th Floor equipment
(UUID(), 'Switch', 'Aruba', 'CX 6200F', 'SW-F6-001', 6, 'IT Closet', 95, 220, 'Managed', '["SNMP"]', '2024-02-20', '2029-02-20', 'Operational'),
(UUID(), 'CCTV', 'Hikvision', 'DS-2CD2385G1-I', 'CAM-F6-001', 6, 'Meeting Room', 12, 220, 'PoE', '["ONVIF"]', '2024-01-30', '2027-01-30', 'Operational'),
(UUID(), 'Climate', 'Daikin', 'VRV Mini', 'AC-F6-001', 6, 'HVAC Room', 3200, 220, 'BACnet/IP', '["BACnet"]', '2023-12-01', '2028-12-01', 'Operational'),

-- 7th Floor equipment
(UUID(), 'Switch', 'Cisco', 'Catalyst 2960-X', 'SW-F7-001', 7, 'IT Closet', 120, 220, 'PoE', '["SNMP"]', '2024-02-15', '2029-02-15', 'Operational'),
(UUID(), 'CCTV', 'Axis', 'P3245-LVE', 'CAM-F7-001', 7, 'Training Room', 12, 220, 'PoE', '["ONVIF"]', '2024-01-25', '2027-01-25', 'Operational'),
(UUID(), 'Capteur', 'Akcp', 'sensorProbe2', 'SENSOR-F7-AIR', 7, 'Office', 10, 220, 'Ethernet', '["SNMP"]', '2024-02-10', '2027-02-10', 'Operational'),

-- 8th Floor equipment
(UUID(), 'Switch', 'Aruba', 'CX 6200F', 'SW-F8-001', 8, 'IT Closet', 95, 220, 'Managed', '["SNMP"]', '2024-02-20', '2029-02-20', 'Operational'),
(UUID(), 'CCTV', 'Hikvision', 'DS-2CD2385G1-I', 'CAM-F8-001', 8, 'Admin Area', 12, 220, 'PoE', '["ONVIF"]', '2024-01-30', '2027-01-30', 'Operational'),
(UUID(), 'Automate', 'Schneider Electric', 'Zelio Logic', 'PLC-F8-ACCESS', 8, 'Security Room', 20, 220, 'Ethernet', '["MODBUS"]', '2024-03-10', '2029-03-10', 'Operational'),

-- Roof equipment (Floor 9 - Toit)
(UUID(), 'Climate', 'Daikin', 'VRV IV', 'HVAC-ROOF-001', 9, 'Roof Top', 8500, 380, 'BACnet/IP', '["BACnet", "MODBUS"]', '2023-11-01', '2028-11-01', 'Operational'),
(UUID(), 'Capteur', 'Campbell Scientific', 'CR1000X', 'SENSOR-ROOF-WX', 9, 'Weather Station', 25, 220, 'Ethernet', '["MODBUS", "MQTT"]', '2024-02-20', '2027-02-20', 'Operational'),
(UUID(), 'Switch', 'Cisco', 'IE-3300-8T2S', 'SW-ROOF-001', 9, 'Roof POP', 95, 220, 'Industrial', '["SNMP"]', '2024-01-15', '2029-01-15', 'Operational'),

-- Planned equipment
(UUID(), 'Serveur', 'Dell', 'PowerEdge R750', 'SRV004-FUTURE', 3, 'NOC-DC-R2-U10', 850, 220, 'Dual 25GbE', '["SNMP", "IPMI"]', NULL, NULL, 'Planned'),
(UUID(), 'Switch', 'Cisco', 'Nexus 9300', 'SW-CORE-FUTURE', 3, 'NOC-DC-R1-U30', 420, 220, 'Modular', '["SNMP", "NETCONF"]', NULL, NULL, 'Planned');

-- Display sample statistics
SELECT
    floor,
    COUNT(*) as equipment_count,
    SUM(power_consumption) as total_power_w
FROM equipment
GROUP BY floor
ORDER BY floor;

SELECT
    status,
    COUNT(*) as count
FROM equipment
GROUP BY status;

SELECT
    type,
    COUNT(*) as count,
    AVG(power_consumption) as avg_power_w
FROM equipment
GROUP BY type
ORDER BY count DESC;

SELECT '✓ Sample data inserted successfully!' as Status;
