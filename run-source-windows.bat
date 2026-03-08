@echo off
setlocal EnableDelayedExpansion

echo ===================================================
echo   AgentCHAT - Windows Source Runner
echo   Multi-Agent AI Conversation Platform
echo ===================================================
echo.

cd /d "%~dp0"

:: Port Configuration
set ELECTRON_DEBUG_PORT=59847
set ELECTRON_INSPECT_PORT=61293
set DEV_SERVER_PORT=58743

echo [INFO] Working directory: %CD%
echo [INFO] Dev Server Port: %DEV_SERVER_PORT%
echo.

:: Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do echo [OK] Node.js %%i

:: Install dependencies if needed
if not exist "node_modules" (
    echo [SETUP] Installing dependencies...
    call npm install
)

:: Kill any existing processes on our ports
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%DEV_SERVER_PORT% " 2^>nul') do (
    echo [CLEANUP] Killing process on port %DEV_SERVER_PORT% - PID: %%a
    taskkill /PID %%a /F >nul 2>nul
)

echo.
echo [START] Launching AgentCHAT...
echo.

:: Check for --dev flag
if "%1"=="--dev" (
    echo [MODE] Development mode with DevTools
    set NODE_ENV=development
    start /B npm run dev
    npx wait-on tcp:%DEV_SERVER_PORT% -t 30000
    npx electron . --remote-debugging-port=%ELECTRON_DEBUG_PORT% --inspect=%ELECTRON_INSPECT_PORT%
) else (
    echo [MODE] Standard development mode
    call npm run electron:dev
)

pause
