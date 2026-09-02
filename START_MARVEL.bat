@echo off
title 🦸 Marvel Ascension - Launcher
color 0A

echo.
echo  ==========================================
echo    MARVEL ASCENSION - PROJECT LAUNCHER
echo  ==========================================
echo.

cd /d "%~dp0"
if not exist "package.json" cd /d "C:\Users\sridh\OneDrive\Desktop\MCU"

:: Clean up any lingering zombie processes on port 3001 or 5173
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

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
    echo  [1/2] Dependencies verified.
    echo.
)

echo  [2/2] Starting Marvel Ascension (Frontend + Backend)...
echo.
echo  ==========================================
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:3001
echo  ==========================================
echo.
echo  Press Ctrl+C to stop the servers.
echo.

:: Automatically launch browser after 2 seconds
start "" /b cmd /c "ping 127.0.0.1 -n 3 >nul & start http://localhost:5173"

call npm run dev

pause

