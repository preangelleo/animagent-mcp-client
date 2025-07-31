@echo off
REM AnimAgent MCP Client - One-Click Installer for Windows

echo.
echo ===================================
echo  AnimAgent MCP Client Installer
echo ===================================
echo.

REM Check if Node.js is installed
echo [AnimAgent] Checking prerequisites...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [Error] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

REM Get Node version
for /f "tokens=1" %%i in ('node -v') do set NODE_VERSION=%%i
echo [AnimAgent] Node.js %NODE_VERSION% detected

REM Install dependencies
echo [AnimAgent] Installing dependencies...
call npm install --silent
if %errorlevel% neq 0 (
    echo [Error] Failed to install dependencies
    pause
    exit /b 1
)
echo [AnimAgent] Dependencies installed

REM Check if .env exists
if not exist ".env" (
    echo [AnimAgent] Setting up environment...
    
    REM Copy .env.example to .env
    copy .env.example .env >nul
    
    echo.
    echo [Warning] Please enter your AnimAgent credentials
    echo [Warning] You can find these at https://app.sumatman.ai/welcome
    echo.
    
    set /p USER_ID=Enter your User ID: 
    set /p USER_EMAIL=Enter your Email: 
    
    REM Update .env file
    powershell -Command "(Get-Content .env) -replace 'your_user_id_here', '%USER_ID%' | Set-Content .env"
    powershell -Command "(Get-Content .env) -replace 'your_email@example.com', '%USER_EMAIL%' | Set-Content .env"
    
    echo [AnimAgent] Environment configured
) else (
    echo [AnimAgent] Using existing .env file
)

REM Run setup
echo [AnimAgent] Configuring Claude Desktop...
call npm run setup
if %errorlevel% neq 0 (
    echo [Error] Setup failed
    pause
    exit /b 1
)

REM Success message
echo.
echo ============================================
echo.
echo [AnimAgent] Installation Complete!
echo.
echo Next steps:
echo 1. Restart Claude Desktop
echo 2. Look for 'animagent' in the MCP servers list
echo 3. Try: "Create a 30-second animation about a magical forest"
echo.
echo Need help? Visit: https://github.com/preangelleo/animagent-mcp-client
echo.
echo ============================================
echo.
pause