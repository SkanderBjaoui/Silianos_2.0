@echo off
echo ============================================
echo CHECKING DATABASE STATUS
echo ============================================
echo.

REM Check if MongoDB service is running
echo [1/3] Checking if MongoDB service is running...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    sc query MongoDB | findstr /C:"RUNNING" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ MongoDB service is RUNNING
    ) else (
        echo ❌ MongoDB service is NOT running
        echo    Try starting it with: net start MongoDB
    )
) else (
    echo ⚠️  Could not check MongoDB service status
    echo    (Service name might be different or MongoDB isn't installed)
)

echo.
echo [2/3] Checking backend directory...
cd /d "%~dp0..\silianos-backend"
if exist "package.json" (
    echo ✅ Backend directory found
) else (
    echo ❌ Backend directory not found at: %CD%
    echo    Make sure the backend is set up
    pause
    exit /b 1
)

echo.
echo [3/3] Running database connection test...
echo.
if exist "test_mongodb_connection.js" (
    node test_mongodb_connection.js
) else (
    echo ❌ test_mongodb_connection.js not found
    echo    Make sure you're in the correct directory
)

echo.
echo ============================================
echo.
pause


