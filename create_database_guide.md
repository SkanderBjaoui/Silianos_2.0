# How to Create the Silianos Voyage Database

## Step 1: Open MySQL Command Line

**Option A: Using MySQL Command Line Client**
1. Press `Win + R`
2. Type: `cmd` and press Enter
3. Type: `mysql -u root -p` and press Enter
4. Enter your root password when prompted

**Option B: Using MySQL Workbench (if installed)**
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click on "SQL" tab or create a new query

---

## Step 2: Create Database and User

Copy and paste these commands one by one (or all at once):

```sql
-- Create the database
CREATE DATABASE silianos_voyage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create the user (replace 'your_strong_password' with a real password!)
CREATE USER 'silianos_user'@'%' IDENTIFIED BY 'your_strong_password_here';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON silianos_voyage.* TO 'silianos_user'@'%';

-- Apply the changes
FLUSH PRIVILEGES;

-- Verify the database was created
SHOW DATABASES;
```

**Important:** Replace `'your_strong_password_here'` with a strong password! Write it down somewhere safe.

---

## Step 3: Run the Schema File

You have two options:

### Option A: Using Command Line (Recommended)

1. Open Command Prompt (cmd) as Administrator
2. Navigate to your project folder:
   ```cmd
   cd "C:\Users\bjaou\Desktop\my projects\silianos_2.0\Silianos-ng"
   ```
3. Run the SQL file:
   ```cmd
   mysql -u silianos_user -p silianos_voyage < database_schema.sql
   ```
4. Enter the password you set for `silianos_user`

### Option B: Using MySQL Command Line

1. Connect to MySQL:
   ```cmd
   mysql -u root -p
   ```
2. Use the database:
   ```sql
   USE silianos_voyage;
   ```
3. Copy the entire contents of `database_schema.sql` file
4. Paste it into the MySQL command line and press Enter

### Option C: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your server
3. Click "File" → "Open SQL Script"
4. Select `database_schema.sql`
5. Click the "Execute" button (lightning bolt icon) or press `Ctrl + Shift + Enter`

---

## Step 4: Verify Tables Were Created

Run this command to see all your tables:

```sql
USE silianos_voyage;
SHOW TABLES;
```

You should see:
- admin_users
- bookings
- testimonials
- blog_posts
- contact_messages
- gallery_images
- services
- pricing_packages

---

## Step 5: Verify Admin User Was Created

```sql
SELECT * FROM admin_users;
```

You should see one admin user with username 'admin'.

**Important:** The default password hash in the schema is just a placeholder. You need to:
1. Generate a proper bcrypt hash for your password
2. Update the admin_users table

To update the admin password properly:
```sql
-- First, generate a bcrypt hash at: https://bcrypt-generator.com/
-- Then update the admin user:
UPDATE admin_users 
SET password_hash = '$2b$10$YOUR_GENERATED_HASH_HERE' 
WHERE username = 'admin';
```

---

## Quick Reference Commands

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE silianos_voyage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'silianos_user'@'%' IDENTIFIED BY 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON silianos_voyage.* TO 'silianos_user'@'%';
FLUSH PRIVILEGES;

-- Use database
USE silianos_voyage;

-- Show tables
SHOW TABLES;

-- Check table structure
DESCRIBE bookings;
```

---

## Troubleshooting

**Error: "Access denied"**
- Make sure you're using the correct password
- Try connecting as root first: `mysql -u root -p`

**Error: "Database already exists"**
- Either drop it first: `DROP DATABASE silianos_voyage;`
- Or use: `CREATE DATABASE IF NOT EXISTS silianos_voyage;`

**Error: "Table already exists"**
- The schema uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times
- If you want to start fresh: `DROP DATABASE silianos_voyage;` then recreate

**Can't find database_schema.sql file**
- Make sure you're in the correct directory
- The file should be in: `C:\Users\bjaou\Desktop\my projects\silianos_2.0\Silianos-ng\database_schema.sql`

---

## Next Steps

After creating the database:
1. ✅ Database created
2. ✅ User created with permissions
3. ✅ Tables created
4. ⏭️ Set up backend API to connect to this database
5. ⏭️ Update Angular service to use API endpoints






