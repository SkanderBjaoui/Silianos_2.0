-- Quick Database Creation Script
-- Run this in MySQL to create everything at once

-- Create database
CREATE DATABASE IF NOT EXISTS silianos_voyage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE silianos_voyage;

-- Create user (if not exists - adjust password!)
CREATE USER IF NOT EXISTS 'silianos_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON silianos_voyage.* TO 'silianos_user'@'localhost';
FLUSH PRIVILEGES;

-- Now run the database_schema.sql file to create all tables
-- Or continue below to create tables directly...






