-- ============================================
-- VERIFY ADMIN ACCOUNT AND PASSWORD HASH
-- ============================================

USE silianos_voyage;

-- Check the admin account
SELECT 
    id,
    username,
    email,
    full_name,
    is_active,
    created_at,
    last_login,
    -- Show the full password hash
    password_hash,
    -- Check if hash starts with correct bcrypt prefix
    CASE 
        WHEN password_hash LIKE '$2b$10$%' THEN '✅ Valid bcrypt hash'
        ELSE '❌ Invalid hash format'
    END AS hash_status,
    -- Check hash length (bcrypt hashes are 60 characters)
    LENGTH(password_hash) AS hash_length
FROM admin_users
WHERE username = 'admin';

-- ============================================
-- EXPECTED RESULTS:
-- - username: admin
-- - hash_status: ✅ Valid bcrypt hash
-- - hash_length: 60
-- - password_hash should start with: $2b$10$Ir/7mVtv8vFAucAM3A50QemKwNxh6UhANJMOb6lh.ZYVhz0WNhZVi
-- ============================================





