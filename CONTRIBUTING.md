# 🤝 Contributing to Ollama Code Fixer

Спасибо за интерес к участию в развитии Ollama Code Fixer! 🎉

## 📋 Code of Conduct

Участвуя в этом проекте, вы соглашаетесь соблюдать наш [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Как внести вклад

### 🐛 Reporting Bugs

Перед тем как создать bug report:
- Убедитесь, что проблема еще не была зарепорчена
- Проверьте [troubleshooting guide](README.md#🔍-отладка)

При создании bug report включите:
- Описание проблемы
- Шаги для воспроизведения
- Ожидаемое и фактическое поведение
- Скриншоты (если применимо)
- Информацию о системе

### ✨ Suggesting Features

Мы приветствуем предложения новых функций! Создайте feature request с:
- Четким описанием функции
- Объяснением, почему эта функция была бы полезна
- Примерами использования

### 💻 Code Contributions

#### 🛠 Настройка разработки

1. **Fork** репозиторий
2. **Clone** ваш fork:
   ```bash
   git clone https://github.com/ваш-username/ollama-code-fixer.git
   cd ollama-code-fixer
   ```
3. **Установите** зависимости:
   ```bash
   npm install
   ```
4. **Откройте** в VS Code:
   ```bash
   code .
   ```

#### 🔧 Разработка

1. **Создайте** branch для вашей функции:
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Сделайте** изменения в коде

3. **Скомпилируйте** TypeScript:
   ```bash
   npm run compile
   ```

4. **Запустите** расширение для тестирования:
   - Нажмите **F5** в VS Code
   - Или используйте: `code --extensionDevelopmentPath=. --new-window`

5. **Проверьте** линтер:
   ```bash
   npm run lint
   ```

6. **Запустите** тесты:
   ```bash
   npm test
   ```

#### 📝 Стандарты кода

- Используйте **TypeScript** для всего нового кода
- Следуйте **ESLint** правилам
- Добавляйте **JSDoc** комментарии для публичных функций
- Используйте **meaningful** названия переменных и функций

#### 🧪 Тестирование

- Добавляйте **unit tests** для новых функций
- Тестируйте с **разными моделями Ollama**
- Проверяйте работу в **разных языках** программирования
- Тестируйте **error handling**

### 📝 Pull Request Process

1. **Обновите** документацию при необходимости
2. **Добавьте** описание в CHANGELOG.md
3. **Убедитесь**, что все тесты проходят
4. **Создайте** Pull Request с описанием:
   - Что делает ваш PR
   - Как тестировать изменения
   - Связанные issues (если есть)

## 🏗 Архитектура проекта

```
ollama-code-fixer/
├── src/
│   ├── extension.ts          # Главный файл расширения
│   ├── chatProvider.ts       # WebView чат
│   ├── localization.ts       # Многоязычность
│   └── utils/
│       ├── logger.ts         # Логирование
│       └── retry.ts          # Retry механизм
├── images/                   # Иконки и изображения
├── .vscode/                  # VS Code конфигурация
└── package.json              # Manifest расширения
```

### 🔧 Ключевые компоненты

- **OperationType**: Enum всех операций с кодом
- **executeOllamaOperation()**: Универсальная функция для AI операций
- **OllamaCodeFixerViewProvider**: Tree view для боковой панели
- **OllamaCodeFixerChatProvider**: WebView чат интерфейс
- **RetryManager**: Обработка ошибок и повторных попыток

## 📊 Release Process

1. Обновите версию в `package.json`
2. Добавьте изменения в `CHANGELOG.md`
3. Создайте tag: `git tag v0.3.1`
4. Push tag: `git push origin v0.3.1`
5. Создайте GitHub Release
6. Опубликуйте в VS Code Marketplace

## 💡 Tips для новых контрибьюторов

- **Начните с small issues** помеченных как `good first issue`
- **Задавайте вопросы** в Discussions
- **Изучите** существующий код перед началом
- **Тестируйте** ваши изменения с разными моделями
- **Документируйте** новые функции

## 🙏 Спасибо

Каждый вклад важен! От исправления опечаток до добавления новых функций - всё помогает сделать этот проект лучше.

## 📞 Контакты

- **GitHub Issues**: [github.com/Wrzesien/ollama-code-fixer/issues](https://github.com/Wrzesien/ollama-code-fixer/issues)
- **Discussions**: [github.com/Wrzesien/ollama-code-fixer/discussions](https://github.com/Wrzesien/ollama-code-fixer/discussions)
- **Email**: wrzesien.dev@gmail.com 