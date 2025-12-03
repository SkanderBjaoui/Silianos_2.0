-- ============================================
-- CREATE/UPDATE ADMIN ACCOUNT
-- ============================================
-- This script creates a new admin account with:
-- Username: SilianosAdmin
-- Password: @Silianos123456+++
-- ============================================

USE silianos_voyage;

-- Delete the old admin account if it exists (optional - comment out if you want to keep it)
-- DELETE FROM admin_users WHERE username = 'admin';

-- Create the new admin account
-- If the username already exists, it will update the password
INSERT INTO admin_users (username, email, password_hash, full_name, is_active) 
VALUES (
    'SilianosAdmin', 
    'admin@silianos.com', 
    '$2b$10$Ir/7mVtv8vFAucAM3A50QemKwNxh6UhANJMOb6lh.ZYVhz0WNhZVi', 
    'Silianos Administrator', 
    TRUE
)
ON DUPLICATE KEY UPDATE 
    password_hash = '$2b$10$Ir/7mVtv8vFAucAM3A50QemKwNxh6UhANJMOb6lh.ZYVhz0WNhZVi',
    email = 'admin@silianos.com',
    full_name = 'Silianos Administrator',
    is_active = TRUE;

-- Verify the admin account was created
SELECT id, username, email, full_name, is_active, created_at 
FROM admin_users 
WHERE username = 'SilianosAdmin';

-- ============================================
-- ADMIN ACCOUNT CREDENTIALS:
-- Username: SilianosAdmin
-- Password: @Silianos123456+++
-- ============================================





