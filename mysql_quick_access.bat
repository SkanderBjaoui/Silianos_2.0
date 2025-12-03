@echo off
REM Quick MySQL Access Script
REM This script helps you access MySQL easily

echo ========================================
echo MySQL Database Setup for Silianos Voyage
echo ========================================
echo.

REM Try to find MySQL in common locations
set MYSQL_PATH=

if exist "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe" (
    set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 9.5\bin
    goto :found
)

if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin
    goto :found
)

if exist "C:\Program Files (x86)\MySQL\MySQL Server 9.5\bin\mysql.exe" (
    set MYSQL_PATH=C:\Program Files (x86)\MySQL\MySQL Server 9.5\bin
    goto :found
)

echo MySQL not found in common locations.
echo Please enter the full path to MySQL bin folder:
set /p MYSQL_PATH="MySQL bin path (e.g., C:\Program Files\MySQL\MySQL Server 9.5\bin): "

:found
echo.
echo Found MySQL at: %MYSQL_PATH%
echo.
echo Choose an option:
echo 1. Connect to MySQL as root
echo 2. Create database and user
echo 3. Run schema file
echo 4. Exit
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" goto :connect
if "%choice%"=="2" goto :create_db
if "%choice%"=="3" goto :run_schema
if "%choice%"=="4" goto :end

:connect
echo.
echo Connecting to MySQL...
"%MYSQL_PATH%\mysql.exe" -u root -p
goto :end

:create_db
echo.
echo Creating database and user...
echo Please enter MySQL root password when prompted:
"%MYSQL_PATH%\mysql.exe" -u root -p -e "CREATE DATABASE IF NOT EXISTS silianos_voyage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS 'silianos_user'@'%%' IDENTIFIED BY 'YourPassword123!'; GRANT ALL PRIVILEGES ON silianos_voyage.* TO 'silianos_user'@'%%'; FLUSH PRIVILEGES;"
echo.
echo Database created! Remember to change 'YourPassword123!' to your actual password.
pause
goto :end

:run_schema
echo.
echo Running schema file...
echo Please enter silianos_user password when prompted:
cd /d "%~dp0"
"%MYSQL_PATH%\mysql.exe" -u silianos_user -p silianos_voyage < database_schema.sql
echo.
echo Schema file executed!
pause
goto :end

:end
echo.
echo Done!
pause






