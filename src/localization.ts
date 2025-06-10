// localization.ts
import * as vscode from 'vscode';

interface LocaleStrings {
    [key: string]: {
        
        chatTitle: string;
        welcomeMessage: string;
        sendButton: string;
        inputPlaceholder: string;
        loadingMessage: string;
        copyButton: string;
        applyButton: string;
        understood: string;
        codeAppliedSuccess: string;
        
        
        quickPromptsTitle: string;
        fixErrorsPrompt: string;
        optimizePrompt: string;
        addCommentsPrompt: string;
        refactorPrompt: string;
        checkSecurityPrompt: string;
        createTestsPrompt: string;
        explainCodePrompt: string;
        
        selectModel: string;
        modelNotInstalled: string;
        installModel: string;
        changeModel: string;
        modelInstallStarted: string;
        modelInstallProgress: string;
        pleaseWait: string;
        selectAvailableModel: string;
        
        
        error: string;
        unknownError: string;
        noActiveEditor: string;
        noSelection: string;
        apiError: string;
        invalidUrl: string;
        ollamaApiError: string;
        
       
        settings: string;
        temperature: string;
        maxTokens: string;
        topP: string;
        topK: string;
        language: string;
        contextTokens: string;
        repeatPenalty: string;
        presencePenalty: string;
        frequencyPenalty: string;
        mirostat: string;
        mirostatTau: string;
        mirostatEta: string;
        model: string;

        
        retryAttempt: string;
        retryFailed: string;
        checkConnection: string;
        serverTimeout: string;
        serverOverloaded: string;
        networkError: string;
        modelError: string;
        modelCheckFailed: string;
    };
}

const strings: LocaleStrings = {
    'en': {
        chatTitle: '🦙 Ollama Code Fixer',
        welcomeMessage: 'Hello! I can help you analyze and fix code. Choose a quick prompt above or ask your question.',
        sendButton: 'Send',
        inputPlaceholder: 'Enter your question or paste code...',
        loadingMessage: 'Ollama is processing request...',
        copyButton: 'Copy',
        applyButton: 'Apply',
        understood: 'Got it',
        codeAppliedSuccess: 'Code applied successfully!',
        
        quickPromptsTitle: 'Quick Prompts:',
        fixErrorsPrompt: '🔧 Fix Errors',
        optimizePrompt: '⚡ Optimize',
        addCommentsPrompt: '📝 Add Comments',
        refactorPrompt: '🔄 Refactor',
        checkSecurityPrompt: '🔒 Check Security',
        createTestsPrompt: '🧪 Create Tests',
        explainCodePrompt: '❓ Explain Code',
        
        selectModel: 'Select Model',
        modelNotInstalled: 'Model "{0}" is not installed.',
        installModel: 'Install Model',
        changeModel: 'Change Model',
        modelInstallStarted: 'Started installing model {0}.',
        modelInstallProgress: 'Installing model {0}. Please wait for completion in terminal.',
        pleaseWait: 'Please try again after installation completes.',
        selectAvailableModel: 'Select available model',
        
        error: 'Error',
        unknownError: 'Unknown error occurred',
        noActiveEditor: 'No active editor',
        noSelection: 'No text selected',
        apiError: 'API Error',
        invalidUrl: 'Invalid URL',
        ollamaApiError: 'Ollama API Error: {0}',
        
        
        settings: 'Settings',
        temperature: 'Temperature',
        maxTokens: 'Max Tokens',
        topP: 'Top P',
        topK: 'Top K',
        language: 'Language',
        contextTokens: 'Context Length',
        repeatPenalty: 'Repeat Penalty',
        presencePenalty: 'Presence Penalty',
        frequencyPenalty: 'Frequency Penalty',
        mirostat: 'Mirostat',
        mirostatTau: 'Mirostat Tau',
        mirostatEta: 'Mirostat Eta',
        model: 'Model',

      
        retryAttempt: 'Attempt {0} of {1}. Retrying in {2} seconds...',
        retryFailed: 'All retry attempts failed. Last error: {0}',
        checkConnection: 'Please check your connection to Ollama server',
        serverTimeout: 'Server request timed out',
        serverOverloaded: 'Server is currently overloaded',
        networkError: 'Network connection error',
        modelError: 'Model error: {0}',
        modelCheckFailed: 'Failed to check available models: {0}'
    },
    
    'ru': {
        
        chatTitle: '🦙 Ollama Code Fixer',
        welcomeMessage: 'Привет! Я помогу вам с анализом и исправлением кода. Выберите готовую подсказку выше или задайте свой вопрос.',
        sendButton: 'Отправить',
        inputPlaceholder: 'Введите ваш вопрос или вставьте код...',
        loadingMessage: 'Ollama обрабатывает запрос...',
        copyButton: 'Копировать',
        applyButton: 'Применить',
        understood: 'Понятно',
        codeAppliedSuccess: 'Код успешно применён!',
        
        
        quickPromptsTitle: 'Быстрые подсказки:',
        fixErrorsPrompt: '🔧 Исправить ошибки',
        optimizePrompt: '⚡ Оптимизировать',
        addCommentsPrompt: '📝 Добавить комментарии',
        refactorPrompt: '🔄 Рефакторинг',
        checkSecurityPrompt: '🔒 Проверить безопасность',
        createTestsPrompt: '🧪 Создать тесты',
        explainCodePrompt: '❓ Объяснить код',
        
        
        selectModel: 'Выбрать модель',
        modelNotInstalled: 'Модель "{0}" не установлена.',
        installModel: 'Установить модель',
        changeModel: 'Сменить модель',
        modelInstallStarted: 'Начата установка модели {0}.',
        modelInstallProgress: 'Установка модели {0}. Пожалуйста, дождитесь завершения в терминале.',
        pleaseWait: 'Пожалуйста, повторите запрос после завершения установки.',
        selectAvailableModel: 'Выберите доступную модель',
      
        error: 'Ошибка',
        unknownError: 'Произошла неизвестная ошибка',
        noActiveEditor: 'Нет активного редактора',
        noSelection: 'Нет выделенного текста',
        apiError: 'Ошибка API',
        invalidUrl: 'Некорректный URL',
        ollamaApiError: 'Ошибка Ollama API: {0}',
        
        
        settings: 'Настройки',
        temperature: 'Температура',
        maxTokens: 'Макс. токенов',
        topP: 'Top P',
        topK: 'Top K',
        language: 'Язык',
        contextTokens: 'Длина контекста',
        repeatPenalty: 'Штраф за повторы',
        presencePenalty: 'Штраф за присутствие',
        frequencyPenalty: 'Штраф за частоту',
        mirostat: 'Миростат',
        mirostatTau: 'Тау миростата',
        mirostatEta: 'Эта миростата',
        model: 'Модель',

        retryAttempt: 'Попытка {0} из {1}. Повторная попытка через {2} сек...',
        retryFailed: 'Все попытки выполнить запрос завершились неудачей. Последняя ошибка: {0}',
        checkConnection: 'Пожалуйста, проверьте подключение к серверу Ollama',
        serverTimeout: 'Превышено время ожидания ответа от сервера',
        serverOverloaded: 'Сервер в данный момент перегружен',
        networkError: 'Ошибка сетевого подключения',
        modelError: 'Ошибка модели: {0}',
        modelCheckFailed: 'Не удалось проверить доступные модели: {0}'
    },
    
    'uk': {
        // Українська мова
        chatTitle: '🦙 Ollama Code Fixer',
        welcomeMessage: 'Привіт! Я допоможу вам з аналізом та виправленням коду. Оберіть готову підказку вище або задайте своє питання.',
        sendButton: 'Відправити',
        inputPlaceholder: 'Введіть ваше питання або вставте код...',
        loadingMessage: 'Ollama обробляє запит...',
        copyButton: 'Копіювати',
        applyButton: 'Застосувати',
        understood: 'Зрозуміло',
        codeAppliedSuccess: 'Код успішно застосовано!',
        
        quickPromptsTitle: 'Швидкі підказки:',
        fixErrorsPrompt: '🔧 Виправити помилки',
        optimizePrompt: '⚡ Оптимізувати',
        addCommentsPrompt: '📝 Додати коментарі',
        refactorPrompt: '🔄 Рефакторинг',
        checkSecurityPrompt: '🔒 Перевірити безпеку',
        createTestsPrompt: '🧪 Створити тести',
        explainCodePrompt: '❓ Пояснити код',
        
        selectModel: 'Обрати модель',
        modelNotInstalled: 'Модель "{0}" не встановлена.',
        installModel: 'Встановити модель',
        changeModel: 'Змінити модель',
        modelInstallStarted: 'Розпочато встановлення моделі {0}.',
        modelInstallProgress: 'Встановлення моделі {0}. Будь ласка, дочекайтеся завершення в терміналі.',
        pleaseWait: 'Будь ласка, повторіть запит після завершення встановлення.',
        selectAvailableModel: 'Оберіть доступну модель',
        
        error: 'Помилка',
        unknownError: 'Сталася невідома помилка',
        noActiveEditor: 'Немає активного редактора',
        noSelection: 'Немає виділеного тексту',
        apiError: 'Помилка API',
        invalidUrl: 'Некоректний URL',
        ollamaApiError: 'Помилка Ollama API: {0}',
        
        settings: 'Налаштування',
        temperature: 'Температура',
        maxTokens: 'Макс. токенів',
        topP: 'Top P',
        topK: 'Top K',
        language: 'Мова',
        contextTokens: 'Довжина контексту',
        repeatPenalty: 'Штраф за повтори',
        presencePenalty: 'Штраф за присутність',
        frequencyPenalty: 'Штраф за частоту',
        mirostat: 'Міростат',
        mirostatTau: 'Тау міростата',
        mirostatEta: 'Ета міростата',
        model: 'Модель',

        retryAttempt: 'Спроба {0} з {1}. Повторна спроба через {2} сек...',
        retryFailed: 'Всі спроби виконати запит завершилися невдачею. Остання помилка: {0}',
        checkConnection: 'Будь ласка, перевірте підключення до сервера Ollama',
        serverTimeout: 'Перевищено час очікування відповіді від сервера',
        serverOverloaded: 'Сервер в даний момент перевантажений',
        networkError: 'Помилка мережевого підключення',
        modelError: 'Помилка моделі: {0}',
        modelCheckFailed: 'Не вдалося перевірити доступні моделі: {0}'
    },
    
    'es': {
        // Español
        chatTitle: '🦙 Ollama Code Fixer',
        welcomeMessage: '¡Hola! Puedo ayudarte a analizar y corregir código. Elige una sugerencia rápida arriba o haz tu pregunta.',
        sendButton: 'Enviar',
        inputPlaceholder: 'Escribe tu pregunta o pega el código...',
        loadingMessage: 'Ollama está procesando la solicitud...',
        copyButton: 'Copiar',
        applyButton: 'Aplicar',
        understood: 'Entendido',
        codeAppliedSuccess: '¡Código aplicado con éxito!',
        
        quickPromptsTitle: 'Sugerencias rápidas:',
        fixErrorsPrompt: '🔧 Corregir errores',
        optimizePrompt: '⚡ Optimizar',
        addCommentsPrompt: '📝 Añadir comentarios',
        refactorPrompt: '🔄 Refactorizar',
        checkSecurityPrompt: '🔒 Verificar seguridad',
        createTestsPrompt: '🧪 Crear pruebas',
        explainCodePrompt: '❓ Explicar código',
        
        selectModel: 'Seleccionar modelo',
        modelNotInstalled: 'El modelo "{0}" no está instalado.',
        installModel: 'Instalar modelo',
        changeModel: 'Cambiar modelo',
        modelInstallStarted: 'Iniciada la instalación del modelo {0}.',
        modelInstallProgress: 'Instalando modelo {0}. Por favor, espera a que se complete en la terminal.',
        pleaseWait: 'Por favor, inténtalo de nuevo después de que se complete la instalación.',
        selectAvailableModel: 'Selecciona un modelo disponible',
        
        error: 'Error',
        unknownError: 'Ocurrió un error desconocido',
        noActiveEditor: 'No hay editor activo',
        noSelection: 'No hay texto seleccionado',
        apiError: 'Error de API',
        invalidUrl: 'URL inválida',
        ollamaApiError: 'Error de Ollama API: {0}',
        
        settings: 'Configuración',
        temperature: 'Temperatura',
        maxTokens: 'Máx. tokens',
        topP: 'Top P',
        topK: 'Top K',
        language: 'Idioma',
        contextTokens: 'Longitud del contexto',
        repeatPenalty: 'Penalización por repetición',
        presencePenalty: 'Penalización por presencia',
        frequencyPenalty: 'Penalización por frecuencia',
        mirostat: 'Mirostat',
        mirostatTau: 'Tau de Mirostat',
        mirostatEta: 'Eta de Mirostat',
        model: 'Modelo',

        retryAttempt: 'Intento {0} de {1}. Reintentando en {2} segundos...',
        retryFailed: 'Todos los intentos fallaron. Último error: {0}',
        checkConnection: 'Por favor, verifica tu conexión al servidor Ollama',
        serverTimeout: 'Tiempo de espera del servidor agotado',
        serverOverloaded: 'El servidor está actualmente sobrecargado',
        networkError: 'Error de conexión de red',
        modelError: 'Error del modelo: {0}',
        modelCheckFailed: 'Error al verificar modelos disponibles: {0}'
    }
};

export function getLocaleStrings(): LocaleStrings[keyof LocaleStrings] {
    const config = vscode.workspace.getConfiguration('ollamaCodeFixer');
    const language = config.get<string>('language', 'en');
    return strings[language] || strings['en'];
}
