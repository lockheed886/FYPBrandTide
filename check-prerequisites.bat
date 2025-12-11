@echo off
echo ========================================
echo    BrandTide Prerequisites Checker
echo ========================================
echo.

set "allGood=1"

echo Checking Node.js...
where node >nul 2>&1
if %errorlevel% equ 0 (
    node --version
    echo [OK] Node.js is installed
) else (
    echo [MISSING] Node.js is not installed
    echo Please download from: https://nodejs.org/
    set "allGood=0"
)

echo.
echo Checking npm...
where npm >nul 2>&1
if %errorlevel% equ 0 (
    npm --version
    echo [OK] npm is installed
) else (
    echo [MISSING] npm is not installed
    set "allGood=0"
)

echo.
echo Checking MongoDB...
where mongod >nul 2>&1
if %errorlevel% equ 0 (
    mongod --version | findstr /C:"db version"
    echo [OK] MongoDB is installed
) else (
    echo [MISSING] MongoDB is not installed
    echo Please download from: https://www.mongodb.com/try/download/community
    set "allGood=0"
)

echo.
echo Checking Git...
where git >nul 2>&1
if %errorlevel% equ 0 (
    git --version
    echo [OK] Git is installed
) else (
    echo [WARNING] Git is not installed (optional)
    echo Download from: https://git-scm.com/download/win
)

echo.
echo ========================================
if "%allGood%"=="1" (
    echo    All Prerequisites Met!
    echo ========================================
    echo.
    echo You're ready to set up BrandTide!
    echo.
    echo Next steps:
    echo 1. Run setup-backend.bat to configure backend
    echo 2. Create .env file in root for frontend
    echo 3. Run start-all.bat to launch the application
) else (
    echo    Missing Prerequisites
    echo ========================================
    echo.
    echo Please install the missing components above
    echo before setting up BrandTide.
)

echo.
pause
