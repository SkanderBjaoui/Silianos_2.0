-- ============================================
-- FIX ADMIN ACCOUNT
-- ============================================
-- This script will:
-- 1. Create SilianosAdmin account (if it doesn't exist)
-- 2. Update the password for the existing 'admin' account
-- ============================================

USE silianos_voyage;

-- Option 1: Create new SilianosAdmin account
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

-- Option 2: Update existing 'admin' account password to match
UPDATE admin_users 
SET password_hash = '$2b$10$Ir/7mVtv8vFAucAM3A50QemKwNxh6UhANJMOb6lh.ZYVhz0WNhZVi',
    full_name = 'Silianos Administrator',
    is_active = TRUE
WHERE username = 'admin';

-- Verify both accounts
SELECT id, username, email, full_name, is_active, created_at, last_login
FROM admin_users
WHERE username IN ('admin', 'SilianosAdmin')
ORDER BY username;

-- ============================================
-- AFTER RUNNING THIS SCRIPT:
-- ============================================
-- You can log in with EITHER:
-- 1. Username: admin, Password: @Silianos123456+++
-- 2. Username: SilianosAdmin, Password: @Silianos123456+++
-- ============================================





