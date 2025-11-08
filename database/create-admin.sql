-- Create default admin user
-- Password: admin (hashed with bcrypt)
-- Note: This hash is for 'admin' - change this in production!

USE artf_building;

-- Insert admin user with password 'admin'
-- bcrypt hash for 'admin': $2a$10$3euPcmQFCiblsZeEu5s7p.xsc19UvKKUQYmVRhYJAuQRDr5nJYW46
INSERT INTO users (id, username, password, full_name, email, role, is_active) VALUES
(UUID(), 'admin', '$2a$10$3euPcmQFCiblsZeEu5s7p.xsc19UvKKUQYmVRhYJAuQRDr5nJYW46', 'Administrateur', 'admin@artf.cd', 'admin', TRUE)
ON DUPLICATE KEY UPDATE password = '$2a$10$3euPcmQFCiblsZeEu5s7p.xsc19UvKKUQYmVRhYJAuQRDr5nJYW46';

SELECT '✓ Admin user created/updated successfully! Username: admin, Password: admin' as Status;
