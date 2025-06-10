# 🦙 Ollama Code Fixer - AI Coding Assistant

**Comprehensive AI-powered coding assistant using local Ollama models in VS Code.**

![Version](https://img.shields.io/badge/version-0.3.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Ollama](https://img.shields.io/badge/Ollama-Compatible-orange.svg)
![Platform](https://img.shields.io/badge/platform-VS%20Code-blue.svg)
![Languages](https://img.shields.io/badge/languages-4-green.svg)

## 🌟 Features

### 🔧 Code Operations
- **Fix Code** - Automatic error and bug fixing
- **Optimize Code** - Performance and readability optimization
- **Explain Code** - Detailed explanations of code logic
- **Add Comments** - Generate comments and documentation
- **Generate Tests** - Create unit tests with edge case coverage
- **Refactor Code** - Improve structure and architecture
- **Security Check** - Analyze security vulnerabilities
- **Generate Code** - Create code from descriptions
- **Translate Code** - Convert between programming languages

### 🚀 Ollama Management
- **Auto-start Server** - Automatic Ollama startup when needed
- **Model Selection** - Quick switching between installed models
- **Model Installation** - Download and install new AI models
- **Status Monitoring** - Real-time API status tracking

### 🎯 Smart Features
- **Auto Code Insertion** - Configurable change application
- **Preview Mode** - Preview changes before applying
- **Flexible Positioning** - Replace, insert above/below, or new file
- **Backup Creation** - Automatic original code backup
- **Intelligent Chat** - Full-featured AI coding assistant

## 🛠 Installation

### Prerequisites
1. **Ollama** - [Download and install](https://ollama.ai/)
2. **VS Code** version 1.85.0 or higher

### Extension Installation
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Ollama Code Fixer"
4. Click Install

### Ollama Setup
```bash
# Install a model (e.g.)
ollama pull codellama:7b

# Start the server
ollama serve
```

## 🎮 Usage

### Context Menu
1. **Select code** in the editor
2. **Right-click** → choose operation:
   - 🔧 Fix Code
   - ⚡ Optimize Code  
   - 📝 Explain Code
   - 💬 Add Comments
   - 🧪 Generate Tests
   - 🔄 Refactor Code
   - 🔒 Security Check

### Command Palette
1. Press **Ctrl+Shift+P**
2. Type "Ollama" to view all commands

### Sidebar Panel
1. Click **Ollama** icon in Activity Bar
2. Use the tool panel:
   - 🚀 Start Ollama - start server
   - 🎯 Select Model - choose model
   - 📥 Install Model - install new model
   - 💬 Open AI Chat - open chat

### Code Generation
1. Place cursor where needed
2. **Ctrl+Shift+P** → "Generate Code"
3. Describe what you want to create
4. AI generates code from description

## ⚙️ Configuration

### Basic Settings
```json
{
  "ollamaCodeFixer.modelName": "codellama:7b",
  "ollamaCodeFixer.ollamaApiUrl": "http://localhost:11434",
  "ollamaCodeFixer.language": "en",
  "ollamaCodeFixer.autoApplyChanges": false,
  "ollamaCodeFixer.showPreviewBeforeApply": true
}
```

### Behavior Settings
- **autoApplyChanges** - Auto-apply without confirmation
- **insertPosition** - Where to insert code: `replace`, `above`, `below`, `newFile`
- **backupOriginalCode** - Create backup copies
- **autoStartOllama** - Auto-start Ollama server

### Model Settings
- **temperature** (0.0-2.0) - Response creativity
- **topP** (0.0-1.0) - Nucleus sampling  
- **topK** (1-100) - Top-k sampling
- **maxTokens** - Maximum response length
- **contextLength** - Context size

## 🌐 Multilingual Support

Supported interface languages:
- 🇺🇸 **English** (default)
- 🇷🇺 **Russian** 
- 🇺🇦 **Ukrainian**
- 🇪🇸 **Spanish**

```json
{
  "ollamaCodeFixer.language": "en"  // en, ru, uk, es
}
```

**Change language:** Ctrl+Shift+P → "🌐 Change Language"

## 🔧 Supported Programming Languages

- **Web:** JavaScript, TypeScript, HTML, CSS, SCSS
- **Backend:** Python, Java, C#, Go, Rust, PHP, Ruby
- **Mobile:** Swift, Kotlin, Dart
- **Systems:** C, C++, Scala
- **Data:** SQL, R, Julia
- **DevOps:** Shell, PowerShell, Docker, YAML
- **And many more...**

## 🎯 Recommended Models

### For Programming
- `codellama:7b` - Optimal balance of speed and quality
- `codellama:13b` - Higher quality
- `codegemma:7b` - Fast code processing

### General Purpose
- `llama2:7b` - Good overall quality
- `mistral:7b` - Fast and efficient
- `gemma:7b` - Balanced performance

## 📊 Usage Examples

### Error Fixing
```python
# Select problematic code
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)  # Inefficient

# Right-click → Fix Code
# Get optimized version with memoization
```

### Test Generation
```javascript
// Select function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Right-click → Generate Tests
// Get comprehensive test suite
```

### Code Explanation
```sql
-- Select complex query
SELECT u.name, COUNT(o.id) as order_count,
       AVG(o.total) as avg_order_value
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5;

-- Right-click → Explain Code
-- Get detailed logic explanation
```

## 🔄 Workflow

1. **Select code** or place cursor
2. **Choose operation** via context menu or Command Palette
3. **Preview result** (if preview is enabled)
4. **Apply changes** or save to new file
5. **Use chat** for additional questions

## 🛡️ Security

- **Local Processing** - Your code never leaves your machine
- **No Internet Requests** - Everything works through local Ollama
- **Backup Creation** - Automatic original code backup
- **Preview Mode** - Control before applying changes

## 🎨 User Interface

### Status Bar
- **$(check) Ollama: Active** - Server running
- **$(error) Ollama: Offline** - Server unavailable
- Click to check status

### Sidebar Panel
Complete toolset with icons:
- 🔧 Code fixing
- ⚡ Optimization 
- 📝 Explanations
- 💬 Comments
- 🧪 Tests
- 🔄 Refactoring
- 🔒 Security
- ✨ Generation
- 💬 AI Chat

## 🔍 Debugging

### Logging
```json
{
  "ollamaCodeFixer.logLevel": "debug"
}
```

Log levels:
- `error` - Errors only
- `warn` - Warnings
- `info` - Information (default)
- `debug` - Detailed debugging

### Status Check
- **Command Palette** → "Ollama: Check API Status"
- **Status Bar** → click Ollama status
- **Output Panel** → "Ollama Code Fixer"

## 🤝 Contributing

1. Fork the project
2. Create feature branch
3. Make changes
4. Add tests
5. Create Pull Request

## 📋 TODO

- [ ] CodeLens support
- [ ] Git integration
- [ ] Full project analysis
- [ ] Custom prompts
- [ ] Framework-specific plugins
- [ ] Cloud model support

## 📝 Changelog

### v0.3.0 - 2024-12-19

#### 🚀 New Features
- **Full AI agent** with 9 different code operations
- **Multilingual support** - 4 interface languages (EN, RU, UK, ES)
- **Ollama management** - auto-start, model selection and installation
- **Automatic model installation** with real-time progress bar
- **Flexible insertion settings** - replace, above, below or new file
- **Context menu** with full operation set for selected code
- **Preview mode** for changes before applying
- **Backup creation** of original code to clipboard
- **Auto-start Ollama** when server unavailable

#### 🎨 Interface Improvements
- **New icons** for all operations
- **Enhanced sidebar** with extended functionality
- **Informative status bar** with clickable status
- **Welcome message** for new users

#### ⚙️ Settings
- **Extended model parameters** (temperature, top_p, top_k)
- **Behavior settings** (auto-apply, preview, position)
- **Model management** (ollama path, preferred models)

## 📞 Support & Contacts

- **🐛 GitHub Issues**: [Report a Problem](https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant/issues)
- **💬 Discussions**: [Ideas & Suggestions](https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant/discussions)
- **📖 Documentation**: [README on GitHub](https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant#readme)
- **⭐ Star on GitHub**: [Support the Project](https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Useful Links

- **📦 VS Code Marketplace**: [Download Extension](https://marketplace.visualstudio.com/items?itemName=waiperok.ollama-code-fixer)
- **🦙 Ollama**: [Official Website](https://ollama.ai/)
- **📚 Ollama Models**: [Model Library](https://ollama.ai/library)
- **💻 VS Code API**: [Developer Documentation](https://code.visualstudio.com/api)

## 🤝 Contribute

This project is open for contributions! If you have ideas for improvement:

1. **Fork** this repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

**Made with ❤️ for developers using local AI models**

[![GitHub stars](https://img.shields.io/github/stars/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant.svg?style=social&label=Star)](https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant)
[![GitHub forks](https://img.shields.io/github/forks/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant.svg?style=social&label=Fork)](https://github.com/WaiperOK/Ollama-Code-Fixer---AI-Coding-Assistant/fork)
