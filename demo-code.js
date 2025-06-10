// 🦙 Ollama Code Fixer - Demo File
// Этот файл содержит примеры кода для тестирования всех функций расширения

// ❌ ПРИМЕР 1: Код с ошибками (для Fix Code)
function calculateAverage(numbers) {
    let sum = 0;
    for (let i = 0; i <= numbers.length; i++) {  // Ошибка: <= вместо <
        sum += numbers[i];
    }
    return sum / numbers.length;
}

// ⚡ ПРИМЕР 2: Неоптимизированный код (для Optimize Code)
function findDuplicates(arr) {
    let duplicates = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                if (duplicates.indexOf(arr[i]) === -1) {
                    duplicates.push(arr[i]);
                }
            }
        }
    }
    return duplicates;
}

// 📝 ПРИМЕР 3: Код без комментариев (для Add Comments)
function fibonacci(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

// 🔒 ПРИМЕР 4: Небезопасный код (для Security Check)
function executeUserCommand(userInput) {
    // Небезопасно! Возможна инъекция команд
    const { exec } = require('child_process');
    return exec(userInput);
}

function validateUser(username, password) {
    // Небезопасно! Обычное сравнение строк
    return username === 'admin' && password === 'password123';
}

// 🔄 ПРИМЕР 5: Код для рефакторинга (для Refactor Code)
let userData = {};
function processUser(name, age, email, phone, address) {
    if (name && age && email) {
        if (age >= 18) {
            if (email.includes('@')) {
                userData.name = name;
                userData.age = age;
                userData.email = email;
                userData.phone = phone;
                userData.address = address;
                userData.isValid = true;
                return userData;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}

// 🧪 ПРИМЕР 6: Функция без тестов (для Generate Tests)
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function formatCurrency(amount, currency = 'USD') {
    if (typeof amount !== 'number' || amount < 0) {
        throw new Error('Invalid amount');
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// 🌐 ПРИМЕР 7: Код для перевода (для Translate Code)
// Выделите этот JavaScript код и переведите в Python
function mergeArrays(arr1, arr2) {
    const result = [...arr1];
    for (const item of arr2) {
        if (!result.includes(item)) {
            result.push(item);
        }
    }
    return result.sort();
}

// ❓ ПРИМЕР 8: Сложный код для объяснения (для Explain Code)
const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
};

// ✨ ИНСТРУКЦИИ ДЛЯ GENERATE CODE:
// Поставьте курсор в любое место и используйте "Generate Code"
// Примеры описаний:
// - "Create a function to validate a credit card number"
// - "Generate a React component for user profile"
// - "Write a function to sort objects by multiple properties"
// - "Create a debounce function with TypeScript types"
// - "Generate SQL query to find top 10 customers by sales"

/* 
🎯 КАК ИСПОЛЬЗОВАТЬ ЭТОТ ФАЙЛ:

1. 🔧 FIX CODE:
   - Выделите функцию calculateAverage
   - Правый клик → "🔧 Fix Code"

2. ⚡ OPTIMIZE CODE:
   - Выделите функцию findDuplicates
   - Правый клик → "⚡ Optimize Code"

3. 💬 ADD COMMENTS:
   - Выделите функцию fibonacci
   - Правый клик → "💬 Add Comments"

4. 🔒 SECURITY CHECK:
   - Выделите функции executeUserCommand или validateUser
   - Правый клик → "🔒 Security Check"

5. 🔄 REFACTOR CODE:
   - Выделите функцию processUser
   - Правый клик → "🔄 Refactor Code"

6. 🧪 GENERATE TESTS:
   - Выделите validateEmail или formatCurrency
   - Правый клик → "🧪 Generate Tests"

7. 🌐 TRANSLATE CODE:
   - Выделите функцию mergeArrays
   - Правый клик → "🌐 Translate Code"
   - Выберите целевой язык (например, Python)

8. 📝 EXPLAIN CODE:
   - Выделите функцию memoize
   - Правый клик → "📝 Explain Code"

9. ✨ GENERATE CODE:
   - Поставьте курсор в любое место
   - Ctrl+Shift+P → "Generate Code"
   - Введите описание того, что нужно создать

10. 💬 AI CHAT:
    - Откройте боковую панель Ollama
    - Нажмите "💬 Open AI Chat"
    - Задайте вопросы о коде
*/ 