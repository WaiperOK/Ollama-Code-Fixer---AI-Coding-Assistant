@echo off
title Ollama Code Fixer - Extension Packager
color 0A
echo.
echo 📦 ===============================================
echo     OLLAMA CODE FIXER - EXTENSION PACKAGER
echo    ===============================================
echo.

REM Проверяем наличие vsce
echo 🔍 Checking if vsce is installed...
call vsce --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ vsce is not installed globally!
    echo.
    echo 📥 Installing vsce globally...
    call npm install -g @vscode/vsce
    if %ERRORLEVEL% neq 0 (
        echo ❌ Failed to install vsce!
        pause
        exit /b 1
    )
    echo ✅ vsce installed successfully!
)
echo ✅ vsce is available
echo.

REM Очистка старых .vsix файлов
echo 🧹 Cleaning old .vsix files...
if exist "*.vsix" (
    del "*.vsix"
    echo ✅ Old .vsix files removed
) else (
    echo ℹ️ No old .vsix files found
)
echo.

REM Установка зависимостей
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.

REM Компиляция TypeScript
echo 🔧 Compiling TypeScript...
call npm run compile
if %ERRORLEVEL% neq 0 (
    echo ❌ Compilation failed!
    echo.
    echo 💡 Try fixing TypeScript errors first:
    echo    - Check src/ files for errors
    echo    - Run: npm run lint
    pause
    exit /b 1
)
echo ✅ TypeScript compiled successfully
echo.

REM Проверка структуры проекта
echo 🔍 Checking project structure...
if not exist "dist\extension.js" (
    echo ❌ dist\extension.js not found!
    echo    Compilation might have failed
    pause
    exit /b 1
)
echo ✅ Extension files found

if not exist "package.json" (
    echo ❌ package.json not found!
    pause
    exit /b 1
)
echo ✅ package.json found

if not exist "README.md" (
    echo ⚠️ README.md not found (recommended)
) else (
    echo ✅ README.md found
)

if not exist "images\icon.png" (
    echo ⚠️ Icon not found (might be required)
) else (
    echo ✅ Icon found
)
echo.

REM Создание .vsix пакета
echo 📦 Creating .vsix package...
echo.
call vsce package
if %ERRORLEVEL% neq 0 (
    echo ❌ Packaging failed!
    echo.
    echo 💡 Common issues:
    echo    - Missing 'publisher' in package.json
    echo    - Missing icon file
    echo    - Invalid package.json format
    echo    - Files in .vscodeignore
    echo.
    echo 🔧 Try running: vsce ls
    echo    to see what would be included
    pause
    exit /b 1
)
echo.

REM Показываем результат
echo ✅ ============================================
echo       EXTENSION PACKAGED SUCCESSFULLY!
echo    ============================================
echo.
echo 📁 Created files:
dir *.vsix /b
echo.

REM Информация о файле
for %%f in (*.vsix) do (
    echo 📊 File info:
    echo    Name: %%f
    echo    Size: %%~zf bytes ^(%.2f KB^)
    set /a size_kb=%%~zf/1024
    echo           ~!size_kb! KB
)
echo.

echo 🎯 What you can do now:
echo    1. Install locally: code --install-extension your-file.vsix
echo    2. Share with others: send the .vsix file
echo    3. Test on another machine
echo    4. Publish to marketplace: vsce publish
echo.

echo 💡 Installation commands:
for %%f in (*.vsix) do (
    echo    code --install-extension %%f
)
echo.

echo ✨ Happy coding with your Ollama AI assistant!
pause 