@echo off
title Ollama Code Fixer - Extension Launcher
echo 🚀 Launching Ollama Code Fixer Extension...
echo.

echo 📁 Current directory: %CD%
echo.

echo 🔧 Compiling TypeScript...
call npm run compile
if %ERRORLEVEL% neq 0 (
    echo ❌ Compilation failed!
    pause
    exit /b 1
)
echo ✅ Compilation successful!
echo.

echo 🚀 Starting VS Code Extension Development Host...
echo Command: code --extensionDevelopmentPath="%CD%" --new-window
echo.

start "" code --extensionDevelopmentPath="%CD%" --new-window

echo ✅ VS Code launched!
echo.
echo 🔍 Look for:
echo   1. New window titled "[Extension Development Host]"
echo   2. Ollama icon in Activity Bar (left panel)
echo   3. "Ollama: Active" status in status bar (bottom)
echo.
echo 🧪 To test:
echo   1. Open demo-code.js in the new window
echo   2. Select some code with errors
echo   3. Right-click → choose Ollama option
echo.
echo ✨ Extension is starting... Check the new VS Code window!
pause 