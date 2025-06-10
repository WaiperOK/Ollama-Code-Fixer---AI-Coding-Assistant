# PowerShell скрипт для запуска расширения Ollama Code Fixer
Write-Host "🚀 Запуск диагностики расширения Ollama Code Fixer..." -ForegroundColor Green

# Проверяем текущую директорию
$currentPath = Get-Location
Write-Host "📁 Текущая папка: $currentPath" -ForegroundColor Yellow

# Проверяем существование необходимых файлов
$requiredFiles = @("package.json", "dist\extension.js", ".vscode\launch.json")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ Найден: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Не найден: $file" -ForegroundColor Red
    }
}

# Проверяем Ollama
Write-Host "`n🔍 Проверка Ollama..." -ForegroundColor Cyan
try {
    $ollamaVersion = ollama --version 2>$null
    if ($ollamaVersion) {
        Write-Host "✅ Ollama установлен: $ollamaVersion" -ForegroundColor Green
        
        # Проверяем, запущен ли сервер
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:11434" -TimeoutSec 5 -ErrorAction SilentlyContinue
            Write-Host "✅ Ollama сервер активен" -ForegroundColor Green
        } catch {
            Write-Host "⚠️ Ollama сервер не отвечает" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Ollama не найден" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Ошибка проверки Ollama" -ForegroundColor Red
}

# Компилируем код
Write-Host "`n🔧 Компиляция TypeScript..." -ForegroundColor Cyan
try {
    npm run compile
    Write-Host "✅ Компиляция успешна" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка компиляции" -ForegroundColor Red
    exit 1
}

# Запускаем VS Code с расширением
Write-Host "`n🚀 Запуск VS Code Extension Development Host..." -ForegroundColor Cyan
Write-Host "Команда: code --extensionDevelopmentPath=`"$currentPath`" --new-window --disable-extensions" -ForegroundColor Gray

try {
    # Запускаем VS Code и ждем немного
    Start-Process -FilePath "code" -ArgumentList "--extensionDevelopmentPath=`"$currentPath`"", "--new-window", "--disable-extensions" -NoNewWindow
    
    Write-Host "✅ VS Code запущен!" -ForegroundColor Green
    Write-Host "`n🔍 Что искать в новом окне VS Code:" -ForegroundColor Yellow
    Write-Host "1. Заголовок окна должен содержать '[Extension Development Host]'" -ForegroundColor White
    Write-Host "2. В Activity Bar слева должна быть иконка 'Ollama Code Fixer'" -ForegroundColor White
    Write-Host "3. В статус-баре внизу должен быть статус 'Ollama: ...' " -ForegroundColor White
    Write-Host "4. При Ctrl+Shift+P должны быть команды 'Ollama:'" -ForegroundColor White
    
    Write-Host "`n🧪 Для тестирования:" -ForegroundColor Cyan
    Write-Host "1. Откройте файл demo-code.js в новом окне" -ForegroundColor White
    Write-Host "2. Выделите код с ошибкой" -ForegroundColor White
    Write-Host "3. Правый клик → выберите опцию Ollama" -ForegroundColor White
    
} catch {
    Write-Host "❌ Ошибка запуска VS Code: $_" -ForegroundColor Red
    
    Write-Host "`n🔧 Альтернативные способы:" -ForegroundColor Yellow
    Write-Host "1. Откройте VS Code вручную в этой папке: code ." -ForegroundColor White
    Write-Host "2. Нажмите F5 в открытом VS Code" -ForegroundColor White
    Write-Host "3. Или Ctrl+Shift+P → 'Debug: Start Debugging'" -ForegroundColor White
}

Write-Host "`n✨ Готово! Проверьте новое окно VS Code." -ForegroundColor Green 