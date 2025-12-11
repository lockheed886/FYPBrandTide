@echo off
echo ========================================
echo    BrandTide Backend Quick Setup
echo ========================================
echo.

cd ..\server

echo [1/4] Installing dependencies...
call npm install

echo.
echo [2/4] Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created! Please edit ..\server\.env with your configuration.
    echo.
    echo Required: MONGODB_URI, JWT_SECRET
    echo Optional: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
    echo.
    pause
) else (
    echo .env file already exists
)

echo.
echo [3/4] Starting MongoDB...
echo Please ensure MongoDB is running before continuing.
echo Press any key when MongoDB is ready...
pause > nul

echo.
echo [4/4] Seeding database...
call npm run seed

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo To start the backend server:
echo   cd ..\server
echo   npm run dev
echo.
echo Demo account created:
echo   Email: demo@brandtide.com
echo   Password: demo123
echo.
pause
