@echo off
title Push to WaiperOK GitHub Repository
color 0A
echo.
echo 🚀 ===============================================
echo     PUSHING TO WAIPEROK GITHUB REPOSITORY
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

REM Удаляем старый remote origin если существует
echo 🔗 Updating remote origin...
call git remote remove origin >nul 2>&1
call git remote add origin https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant.git
echo ✅ Remote origin set to: https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant.git
echo.

REM Добавляем файлы в staging
echo 📦 Adding all files to staging...
call git add .
echo ✅ Files added to staging
echo.

REM Проверяем статус
echo 📊 Git status:
call git status --short
echo.

REM Делаем коммит
echo 💾 Making commit...
call git commit -m "feat: WaiperOK Ollama Code Fixer v0.3.0

🦙 Complete AI Coding Assistant for VS Code

🎉 Features:
- Full AI agent with 9 code operations (Fix, Optimize, Explain, Comment, Test, Refactor, Security, Generate, Translate)
- Multilingual support (English, Russian, Ukrainian, Spanish)
- Ollama management (auto-start, model selection, installation)
- Context menu integration with all operations
- Intelligent AI chat interface
- Code preview and backup system
- Flexible insertion modes (replace, above, below, new file)
- Real-time status monitoring
- Comprehensive error handling

🔧 Operations:
- 🔧 Fix Code - Automatic error and bug fixing
- ⚡ Optimize Code - Performance and readability optimization
- 📝 Explain Code - Detailed code explanations
- 💬 Add Comments - Generate documentation
- 🧪 Generate Tests - Create comprehensive test suites
- 🔄 Refactor Code - Improve structure and architecture
- 🔒 Security Check - Analyze vulnerabilities
- ✨ Generate Code - Create code from descriptions
- 🌐 Translate Code - Convert between programming languages

🚀 Technologies:
- TypeScript + VS Code Extension API
- Ollama integration with local AI models
- Axios for HTTP requests
- WebView for chat interface
- Tree view for sidebar tools

📦 Ready for VS Code Marketplace publication"

if %ERRORLEVEL% equ 0 (
    echo ✅ Commit created successfully!
) else (
    echo ⚠️ Commit failed or no changes to commit
)
echo.

REM Создаем main branch
echo 🌿 Setting up main branch...
call git branch -M main
echo ✅ Branch set to main
echo.

REM Пушим в GitHub
echo 🚀 Pushing to GitHub...
call git push -u origin main --force

if %ERRORLEVEL% equ 0 (
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 🎉 Your code is now available at:
    echo    https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant
) else (
    echo ❌ Push failed! Please check your GitHub credentials and repository access.
)
echo.

echo 📋 ===============================================
echo      NEXT STEPS:
echo ===============================================
echo.
echo 1. ✅ Repository URL:
echo    https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant
echo.
echo 2. 🔧 Enable GitHub features:
echo    - Go to repository Settings
echo    - Enable Issues
echo    - Enable Discussions
echo    - Set up branch protection (optional)
echo.
echo 3. 📚 Create first release:
echo    - Go to GitHub → Releases → Create a new release
echo    - Tag: v0.3.0
echo    - Title: Ollama Code Fixer v0.3.0 - Complete AI Assistant
echo    - Upload .vsix file if you have it
echo.
echo 4. 📦 VS Code Marketplace:
echo    - Install vsce: npm install -g @vscode/vsce
echo    - Package: vsce package
echo    - Publish: vsce publish (requires publisher account)
echo.
echo 5. 🌟 Share your project:
echo    - Add topics/tags to repository
echo    - Write announcement posts
echo    - Share on developer communities
echo.

pause 