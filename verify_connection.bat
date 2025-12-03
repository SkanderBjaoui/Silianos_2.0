@echo off
echo ========================================
echo Verifying Database Connection
echo ========================================
echo.

echo Testing API endpoints...
echo.

echo 1. Testing Health Endpoint:
curl -s http://localhost:3000/api/health
echo.
echo.

echo 2. Testing Bookings Endpoint:
curl -s http://localhost:3000/api/bookings
echo.
echo.

echo ========================================
echo.
echo If you see JSON responses above, your API is working!
echo If you see errors, make sure:
echo - Backend is running (npm run dev in silianos-backend)
echo - Database is created
echo - .env file has correct credentials
echo.
pause






