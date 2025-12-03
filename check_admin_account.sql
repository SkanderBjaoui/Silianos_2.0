-- ============================================
-- CHECK DATABASE AND ADMIN ACCOUNT
-- ============================================
-- Run this script to verify your database and admin accounts
-- ============================================

USE silianos_voyage;

-- Check if database exists and is accessible
SELECT DATABASE() AS current_database;

-- Show all tables
SHOW TABLES;

-- Check if admin_users table exists and show its structure
DESCRIBE admin_users;

-- List ALL admin users
SELECT 
    id,
    username,
    email,
    full_name,
    is_active,
    created_at,
    last_login,
    -- Show first 20 characters of password hash (don't show full hash for security)
    CONCAT(SUBSTRING(password_hash, 1, 20), '...') AS password_hash_preview
FROM admin_users
ORDER BY created_at DESC;

-- Check specifically for SilianosAdmin account
SELECT 
    id,
    username,
    email,
    full_name,
    is_active,
    created_at,
    last_login
FROM admin_users
WHERE username = 'SilianosAdmin';

-- Count total admin users
SELECT COUNT(*) AS total_admin_users FROM admin_users;

-- ============================================
-- TROUBLESHOOTING:
-- If no rows are returned, the admin account doesn't exist
-- Run create_admin_account.sql to create it
-- ============================================





