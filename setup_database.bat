@echo off
echo ========================================
echo Silianos Voyage Database Setup
echo ========================================
echo.

echo This script will help you create the database.
echo.
echo Step 1: Make sure MySQL is running
echo Step 2: You'll need to run the SQL schema file
echo.

echo Choose an option:
echo 1. I have MySQL Command Line Client installed
echo 2. I have MySQL Workbench
echo 3. Show me the SQL commands to run manually
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" goto :cmd_line
if "%choice%"=="2" goto :workbench
if "%choice%"=="3" goto :manual

:cmd_line
echo.
echo Opening MySQL Command Line...
echo.
echo When prompted, enter your MySQL root password
echo Then run: source database_schema.sql
echo Or copy-paste the contents of database_schema.sql
echo.
pause
start "" "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe" -u root -p
goto :end

:workbench
echo.
echo Open MySQL Workbench and:
echo 1. Connect to your server
echo 2. Click File -^> Open SQL Script
echo 3. Select database_schema.sql
echo 4. Click Execute (lightning bolt icon)
echo.
pause
goto :end

:manual
echo.
echo ========================================
echo Manual Setup Instructions:
echo ========================================
echo.
echo 1. Connect to MySQL:
echo    mysql -u root -p
echo.
echo 2. Run these commands:
echo    CREATE DATABASE silianos_voyage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
echo    USE silianos_voyage;
echo.
echo 3. Copy and paste the entire contents of database_schema.sql
echo.
echo 4. Verify tables were created:
echo    SHOW TABLES;
echo.
pause
goto :end

:end
echo.
echo Done!
pause






