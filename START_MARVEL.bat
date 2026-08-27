@echo off
title 🦸 Marvel Ascension - Launcher
color 0A

echo.
echo  ==========================================
echo    MARVEL ASCENSION - PROJECT LAUNCHER
echo  ==========================================
echo.

cd /d "C:\Users\sridh\OneDrive\Desktop\MCU"

:: Check if node_modules exists
if not exist "node_modules\" (
    echo  [1/2] Installing dependencies... please wait...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo  ERROR: npm install failed. Make sure Node.js is installed.
        echo  Download Node.js from: https://nodejs.org
        pause
        exit /b 1
    )
    echo.
    echo  Dependencies installed successfully!
    echo.
) else (
    echo  [1/2] Dependencies already installed. Skipping...
    echo.
)

echo  [2/2] Starting Marvel Ascension...
echo.
echo  ==========================================
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:3001
echo  ==========================================
echo.
echo  Press Ctrl+C to stop the server.
echo.

call npm start

pause
