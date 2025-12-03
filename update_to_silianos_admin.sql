-- ============================================
-- UPDATE ADMIN USERNAME TO SilianosAdmin
-- ============================================
-- This script will:
-- 1. Change the existing 'admin' username to 'SilianosAdmin'
-- OR
-- 2. Create a new 'SilianosAdmin' account if you prefer
-- ============================================

USE silianos_voyage;

-- OPTION 1: Rename existing admin account to SilianosAdmin
-- Uncomment the line below if you want to rename the existing account:
UPDATE admin_users 
SET username = 'SilianosAdmin'
WHERE username = 'admin';

-- OPTION 2: Create a separate SilianosAdmin account (keep both)
-- If you prefer to have both 'admin' and 'SilianosAdmin', uncomment below:
-- INSERT INTO admin_users (username, email, password_hash, full_name, is_active) 
-- VALUES (
--     'SilianosAdmin', 
--     'admin@silianos.com', 
--     '$2b$10$Ir/7mVtv8vFAucAM3A50QemKwNxh6UhANJMOb6lh.ZYVhz0WNhZVi', 
--     'Silianos Administrator', 
--     TRUE
-- )
-- ON DUPLICATE KEY UPDATE 
--     password_hash = '$2b$10$Ir/7mVtv8vFAucAM3A50QemKwNxh6UhANJMOb6lh.ZYVhz0WNhZVi',
--     email = 'admin@silianos.com',
--     full_name = 'Silianos Administrator',
--     is_active = TRUE;

-- Verify the change
SELECT id, username, email, full_name, is_active, created_at, last_login
FROM admin_users
WHERE username = 'SilianosAdmin';

-- ============================================
-- After running this script, login with:
-- Username: SilianosAdmin
-- Password: @Silianos123456+++
-- ============================================





