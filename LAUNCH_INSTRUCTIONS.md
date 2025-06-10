# 🚀 Инструкции по запуску расширения Ollama Code Fixer

## ✅ Предварительная проверка

Убедитесь, что выполнены все условия:

1. **VS Code открыт в правильной папке**
   - Откройте VS Code
   - File → Open Folder → выберите папку `ollama-fixer`
   - В Explorer должны быть видны файлы: `package.json`, `src/`, `dist/`, `.vscode/`

2. **Код скомпилирован**
   ```bash
   npm run compile
   ```
   Должно завершиться без ошибок.

3. **Файлы на месте**
   - ✅ `package.json`
   - ✅ `dist/extension.js`
   - ✅ `.vscode/launch.json`
   - ✅ `images/icon.png`

## 🎯 Запуск расширения

### Метод 1: F5 (быстрый)
1. Нажмите **F5** в VS Code
2. Выберите "Run Extension" если появится выбор
3. Дождитесь открытия нового окна "[Extension Development Host]"

### Метод 2: Панель Debug
1. Откройте панель "Run and Debug" (Ctrl+Shift+D)
2. Выберите "Run Extension" в выпадающем списке
3. Нажмите зеленую кнопку "Play" или F5

### Метод 3: Command Palette
1. Нажмите Ctrl+Shift+P
2. Введите "Debug: Start Debugging"
3. Выберите первую опцию

## 🔍 Проверка успешного запуска

После запуска должно произойти:

1. **Новое окно VS Code** с заголовком "[Extension Development Host]"
2. **Статус-бар** показывает "Ollama: Checking..." или "Ollama: Offline"  
3. **Боковая панель** появилась иконка "Ollama Code Fixer"
4. **Command Palette** (Ctrl+Shift+P) содержит команды "Ollama:"

## 🧪 Тестирование функций

### Тест 1: Боковая панель
1. Найдите иконку Ollama в Activity Bar (слева)
2. Кликните на неё
3. Должна открыться панель "Fixer Tools"

### Тест 2: Команды
1. Нажмите Ctrl+Shift+P
2. Введите "Ollama"
3. Должны появиться команды:
   - "Ollama: Fix Selected Code"
   - "Ollama: Check API Status"  
   - "Ollama: Open Chat"

### Тест 3: Контекстное меню
1. Откройте любой файл с кодом
2. Выделите несколько строк
3. Правый клик → должна быть опция "Ollama: Fix Selected Code"

### Тест 4: Чат
1. Откройте боковую панель Ollama
2. Нажмите "Open Chat"
3. Должно открыться окно чата

## ❌ Если не запускается

### Проверьте Output панель
1. В новом окне: View → Output
2. Выберите "Extension Host" из выпадающего списка  
3. Проверьте ошибки

### Проверьте Developer Tools
1. В новом окне: Help → Toggle Developer Tools (Ctrl+Shift+I)
2. Вкладка Console
3. Ищите красные ошибки

### Проверьте Terminal панель
1. View → Terminal  
2. Вкладка "Tasks"
3. Проверьте ошибки компиляции

## 🛠️ Решение частых проблем

### "Расширение не активируется"
```bash
# Перекомпилируйте
npm run compile

# Перезапустите VS Code
# Ctrl+Shift+P → "Developer: Reload Window"
```

### "Команды не найдены"
- Убедитесь, что окно "[Extension Development Host]" активно
- Попробуйте перезагрузить окно: Ctrl+R

### "Ошибки в console"
- Проверьте логи в Output → "Ollama Code Fixer"
- Убедитесь, что все зависимости установлены: `npm install`

### "Боковая панель не появляется"
- Проверьте View → Open View... → "Ollama Code Fixer"
- Попробуйте сбросить layout: View → Reset Layout

## 📞 Дополнительная диагностика

Если ничего не помогает:

1. **Проверьте версию VS Code**
   ```
   Help → About
   ```
   Должна быть >= 1.85.0

2. **Очистите кеш**
   ```bash
   # Удалите папки
   rm -rf node_modules out dist
   
   # Переустановите
   npm install
   npm run compile
   ```

3. **Проверьте другие расширения**
   - Отключите все расширения
   - Попробуйте запустить наше расширение

## ✅ Успешный запуск!

Если все работает:
- 🎉 **Поздравляем!** Расширение запущено
- 🔧 Попробуйте исправить код через контекстное меню
- 💬 Откройте чат и задайте вопрос
- ⚙️ Настройте параметры в Settings → Ollama Code Fixer

---

**Важно:** Для работы с Ollama убедитесь, что сервер запущен:
```bash
ollama serve
``` 