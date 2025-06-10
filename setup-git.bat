@echo off
title Ollama Code Fixer - GitHub Setup
color 0A
echo.
echo 🚀 ===============================================
echo     OLLAMA CODE FIXER - GITHUB SETUP
echo    ===============================================
echo.

REM Проверяем наличие git
echo 🔍 Checking if Git is installed...
call git --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Git is not installed!
    echo.
    echo 📥 Please install Git first: https://git-scm.com/download
    pause
    exit /b 1
)
echo ✅ Git is available
echo.

REM Инициализируем Git если не инициализирован
if not exist ".git" (
    echo 📁 Initializing Git repository...
    call git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)
echo.

REM Добавляем remote origin если не существует
echo 🔗 Setting up remote origin...
call git remote get-url origin >nul 2>&1
if %ERRORLEVEL% neq 0 (
    call git remote add origin https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant.git
    echo ✅ Remote origin added: https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant.git
) else (
    echo ✅ Remote origin already exists
    call git remote -v
)
echo.

REM Проверяем Git config
echo ⚙️ Checking Git configuration...
for /f "tokens=*" %%i in ('git config user.name 2^>nul') do set GIT_USER=%%i
for /f "tokens=*" %%i in ('git config user.email 2^>nul') do set GIT_EMAIL=%%i

if "%GIT_USER%"=="" (
    echo ❌ Git user.name not set
    set /p GIT_USER="Enter your name: "
    call git config user.name "%GIT_USER%"
    echo ✅ Git user.name set to: %GIT_USER%
) else (
    echo ✅ Git user.name: %GIT_USER%
)

if "%GIT_EMAIL%"=="" (
    echo ❌ Git user.email not set
    set /p GIT_EMAIL="Enter your email: "
    call git config user.email "%GIT_EMAIL%"
    echo ✅ Git user.email set to: %GIT_EMAIL%
) else (
    echo ✅ Git user.email: %GIT_EMAIL%
)
echo.

REM Добавляем файлы в staging
echo 📦 Adding files to staging...
call git add .
echo ✅ Files added to staging
echo.

REM Проверяем статус
echo 📊 Git status:
call git status --short
echo.

REM Делаем первый коммит
echo 💾 Making initial commit...
call git commit -m "feat: initial commit - Ollama Code Fixer v0.3.0

🎉 Features:
- Full AI agent with 9 code operations
- Multilingual support (EN, RU, UK, ES)  
- Ollama management (auto-start, model selection)
- Context menu integration
- AI chat interface
- Code preview and backup
- Flexible insertion modes"

if %ERRORLEVEL% equ 0 (
    echo ✅ Initial commit created successfully!
) else (
    echo ⚠️ Commit failed or no changes to commit
)
echo.

REM Создаем main branch
echo 🌿 Setting up main branch...
call git branch -M main
echo ✅ Branch set to main
echo.

echo 🎯 ===============================================
echo      NEXT STEPS:
echo ===============================================
echo.
echo 1. 🌐 GitHub repository ready:
echo    - Repository: https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant
echo    - Description: AI code fixer using local Ollama models
echo    - Public repository ready for code
echo.
echo 2. 🚀 Push to GitHub:
echo    git push -u origin main
echo.
echo 3. 📚 Create releases:
echo    - Go to GitHub → Releases → Create a new release
echo    - Tag: v0.3.0
echo    - Upload .vsix file
echo.
echo 4. 🔧 Enable GitHub features:
echo    - Issues
echo    - Discussions
echo    - Wiki (optional)
echo.
echo 5. 📦 Publish to VS Code Marketplace:
echo    - Install vsce: npm install -g @vscode/vsce
echo    - Package: vsce package
echo    - Publish: vsce publish
echo.

pause 