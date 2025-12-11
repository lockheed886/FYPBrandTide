@echo off
echo ========================================
echo    BrandTide Full Stack Launcher
echo ========================================
echo.

echo Starting MongoDB...
start "MongoDB" mongod

timeout /t 3 /nobreak > nul

echo.
echo Starting Backend Server...
cd ..\server
start "BrandTide Backend" cmd /k "npm run dev"

cd ..\brandtide
timeout /t 2 /nobreak > nul

echo.
echo Starting Frontend Server...
start "BrandTide Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    All Servers Started!
echo ========================================
echo.
echo MongoDB:  Running in background
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
echo (Servers will continue running in separate windows)
pause > nul
