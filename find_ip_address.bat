@echo off
echo ========================================
echo Finding Your IP Addresses
echo ========================================
echo.

echo LOCAL NETWORK IP ADDRESS (for same network):
echo ----------------------------------------
ipconfig | findstr /i "IPv4"
echo.

echo PUBLIC IP ADDRESS (for internet access):
echo ----------------------------------------
echo Checking public IP...
powershell -Command "(Invoke-WebRequest -Uri 'https://api.ipify.org' -UseBasicParsing).Content"
echo.

echo ========================================
echo.
echo IMPORTANT:
echo - Use LOCAL IP (192.168.x.x) if connecting from same network
echo - Use PUBLIC IP if connecting from outside your network
echo - Use 127.0.0.1 or localhost if connecting from THIS computer
echo.
pause






