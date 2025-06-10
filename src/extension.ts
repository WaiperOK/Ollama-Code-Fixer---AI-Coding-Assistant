import * as vscode from 'vscode';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { OllamaCodeFixerChatProvider } from './chatProvider';
import { RetryManager } from './utils/retry';
import { Logger } from './utils/logger';
import * as cp from 'child_process';
import * as path from 'path';

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

enum OperationType {
  FIX = 'fix',
  OPTIMIZE = 'optimize',
  EXPLAIN = 'explain',
  COMMENT = 'comment',
  TEST = 'test',
  REFACTOR = 'refactor',
  SECURITY = 'security',
  GENERATE = 'generate',
  TRANSLATE = 'translate'
}

const OPERATION_PROMPTS = {
  [OperationType.FIX]: {
    prefix: "[INST] You are an expert programming assistant. Analyze the provided code and fix any errors, bugs, or issues. Return ONLY the corrected code without explanations.\n\nLanguage: {language}\n\nCode to fix:\n```\n",
    suffix: "\n```\n[/INST]\nFixed code:\n```\n"
  },
  [OperationType.OPTIMIZE]: {
    prefix: "[INST] You are an expert programming assistant. Optimize the provided code for better performance, readability, and best practices. Return ONLY the optimized code without explanations.\n\nLanguage: {language}\n\nCode to optimize:\n```\n",
    suffix: "\n```\n[/INST]\nOptimized code:\n```\n"
  },
  [OperationType.EXPLAIN]: {
    prefix: "[INST] You are an expert programming assistant. Explain what this code does in detail, including its purpose, logic, and any important concepts.\n\nLanguage: {language}\n\nCode to explain:\n```\n",
    suffix: "\n```\n[/INST]\nExplanation:\n"
  },
  [OperationType.COMMENT]: {
    prefix: "[INST] You are an expert programming assistant. Add comprehensive comments to the provided code. Include function descriptions, parameter explanations, and inline comments. Return ONLY the commented code.\n\nLanguage: {language}\n\nCode to comment:\n```\n",
    suffix: "\n```\n[/INST]\nCommented code:\n```\n"
  },
  [OperationType.TEST]: {
    prefix: "[INST] You are an expert programming assistant. Generate comprehensive unit tests for the provided code. Include edge cases and error scenarios. Return ONLY the test code.\n\nLanguage: {language}\n\nCode to test:\n```\n",
    suffix: "\n```\n[/INST]\nTest code:\n```\n"
  },
  [OperationType.REFACTOR]: {
    prefix: "[INST] You are an expert programming assistant. Refactor the provided code to improve its structure, maintainability, and follow best practices. Return ONLY the refactored code.\n\nLanguage: {language}\n\nCode to refactor:\n```\n",
    suffix: "\n```\n[/INST]\nRefactored code:\n```\n"
  },
  [OperationType.SECURITY]: {
    prefix: "[INST] You are an expert security programming assistant. Analyze the provided code for security vulnerabilities and provide a secure version. List found issues and return the secured code.\n\nLanguage: {language}\n\nCode to secure:\n```\n",
    suffix: "\n```\n[/INST]\nSecurity analysis and secured code:\n"
  },
  [OperationType.GENERATE]: {
    prefix: "[INST] You are an expert programming assistant. Generate code based on the description provided. Follow best practices and include proper error handling.\n\nLanguage: {language}\n\nRequirement:\n",
    suffix: "\n[/INST]\nGenerated code:\n```\n"
  },
  [OperationType.TRANSLATE]: {
    prefix: "[INST] You are an expert programming assistant. Translate the provided code to the target programming language while maintaining the same functionality.\n\nSource language: {language}\nTarget language: {targetLanguage}\n\nCode to translate:\n```\n",
    suffix: "\n```\n[/INST]\nTranslated code:\n```\n"
  }
};

function getConfigOrThrow<T>(key: string, defaultValue?: T): T {
  const value = vscode.workspace.getConfiguration('ollamaCodeFixer').get<T>(key);
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing configuration: ollamaCodeFixer.${key}`);
  }
  return value;
}

async function executeOllamaOperation(
  operation: OperationType,
  codeSnippet: string,
  languageId: string,
  targetLanguage?: string
): Promise<string | null> {
  const config = vscode.workspace.getConfiguration('ollamaCodeFixer');
  const logger = Logger.getInstance();
  let baseApiUrl = getConfigOrThrow<string>('ollamaApiUrl', 'http://localhost:11434');
  
  try {
    const urlObj = new URL(baseApiUrl);
    baseApiUrl = `${urlObj.protocol}//${urlObj.host}`;
  } catch (e) {
    logger.error("Invalid ollamaApiUrl, using default base.", e);
    baseApiUrl = 'http://localhost:11434';
  }

  const fullApiUrl = `${baseApiUrl}/api/generate`;
  const modelName = getConfigOrThrow<string>('modelName', 'llama2');
  const requestTimeout = getConfigOrThrow<number>('requestTimeout', 90000);
  const enableNotifications = getConfigOrThrow<boolean>('enableNotifications', true);
  const logLevel = getConfigOrThrow<string>('logLevel', 'info');
  const retryManager = new RetryManager();

  let promptStructure = OPERATION_PROMPTS[operation];
  let prompt = promptStructure.prefix.replace('{language}', languageId);
  
  if (targetLanguage) {
    prompt = prompt.replace('{targetLanguage}', targetLanguage);
  }
  
  prompt += codeSnippet;
  prompt += promptStructure.suffix;

  if (logLevel === 'debug') {
    logger.debug(`Executing ${operation} operation with ${modelName}. Prompt (first 500 chars):\n${prompt.substring(0, 500)}...`);
  }

  try {
    const response: AxiosResponse<OllamaGenerateResponse> = await retryManager.withRetry(
      async () => axios.post(
        fullApiUrl,
        {
          model: modelName,
          prompt: prompt,
          stream: false,
          options: {
            temperature: config.get<number>('temperature', 0.7),
            top_p: config.get<number>('topP', 0.9),
            top_k: config.get<number>('topK', 40),
            repeat_penalty: config.get<number>('repeatPenalty', 1.1),
            num_ctx: config.get<number>('contextLength', 4096),
            num_predict: config.get<number>('maxTokens', 2048),
            stop: config.get<string[]>('stopSequences', ["[/INST]", "</s>", "```"]),
            seed: config.get<number>('seed', -1)
          }
        },
        { timeout: requestTimeout }
      )
    );

    let result = response.data.response.trim();

    if (logLevel === 'debug') {
      logger.debug(`Raw response from model:\n${result}`);
    }

    // Для операций, которые возвращают код, извлекаем его из блока
    if (operation !== OperationType.EXPLAIN && operation !== OperationType.SECURITY) {
      const codeBlockRegex = /```(?:\w*\n)?([\s\S]*?)```$/;
      const match = result.match(codeBlockRegex);

      if (match && match[1]) {
        result = match[1].trim();
        if (logLevel === 'debug') {
          logger.debug(`Extracted code from block:\n${result}`);
        }
      }
    }

    return result;

  } catch (error) {
    let errorMessage: string;
    
    if (error instanceof AxiosError) {
      if (error.response) {
        errorMessage = `Error calling Ollama API: ${error.message}. Status: ${error.response.status}`;
        if (error.response.data) {
          errorMessage += `. Data: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.request) {
        errorMessage = 'No response received from Ollama. Please check if the service is running and accessible.';
      } else {
        errorMessage = `Error configuring request: ${error.message}`;
      }
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Could not connect to Ollama server. Please ensure the service is running.';
        
        // Предложить автозапуск
        const autoStart = config.get<boolean>('autoStartOllama', false);
        if (autoStart) {
          const started = await startOllamaServer();
          if (started) {
            return executeOllamaOperation(operation, codeSnippet, languageId, targetLanguage);
          }
        } else {
          const choice = await vscode.window.showErrorMessage(
            'Ollama server is not running. Would you like to start it?',
            'Start Ollama',
            'Cancel'
          );
          
          if (choice === 'Start Ollama') {
            const started = await startOllamaServer();
            if (started) {
              return executeOllamaOperation(operation, codeSnippet, languageId, targetLanguage);
            }
          }
        }
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = 'Request to Ollama server timed out. The server might be overloaded.';
      }
      
      if (logLevel === 'debug') {
        logger.error('API Call Error:', {
          message: error.message,
          code: error.code,
          config: error.config,
          response: error.response?.data
        });
      }
    } else if (error instanceof Error) {
      errorMessage = `Unexpected error: ${error.message}`;
      logger.error('Unexpected Error:', error);
    } else {
      errorMessage = 'An unknown error occurred';
      logger.error('Unknown Error:', error);
    }
    
    if (enableNotifications) {
      vscode.window.showErrorMessage(errorMessage);
    }
    
    return null;
  }
}

async function startOllamaServer(): Promise<boolean> {
  const config = vscode.workspace.getConfiguration('ollamaCodeFixer');
  const ollamaPath = config.get<string>('ollamaPath', 'ollama');
  const logger = Logger.getInstance();

  return new Promise((resolve) => {
    try {
      logger.info(`Starting Ollama server using: ${ollamaPath}`);
      
      // Запускаем процесс в фоне
      const process = cp.spawn(ollamaPath, ['serve'], {
        detached: true,
        stdio: 'ignore'
      });

      process.unref(); // Позволяем VS Code закрыться без ожидания процесса

      process.on('error', (error) => {
        logger.error('Failed to start Ollama:', error);
        if (error.message.includes('ENOENT')) {
          vscode.window.showErrorMessage('❌ Ollama not found. Please install Ollama first: https://ollama.ai');
        } else {
          vscode.window.showErrorMessage(`❌ Failed to start Ollama: ${error.message}`);
        }
        resolve(false);
      });

      // Показываем прогресс запуска
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "🚀 Starting Ollama server...",
        cancellable: false
      }, async (progress) => {
        progress.report({ increment: 20, message: "Launching Ollama..." });
        
        // Проверяем доступность сервера в течение 10 секунд
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          progress.report({ 
            increment: 8, 
            message: `Waiting for startup... (${i + 1}/10)`
          });
          
          try {
            await axios.get('http://localhost:11434', { timeout: 2000 });
            progress.report({ increment: 100, message: "✅ Server is ready!" });
            vscode.window.showInformationMessage('🎉 Ollama server started successfully!');
            logger.info('Ollama server started and verified');
            resolve(true);
            return;
          } catch {
            // Продолжаем ожидание
          }
        }
        
        // Таймаут
        logger.warn('Ollama server startup timeout');
        vscode.window.showWarningMessage('⚠️ Ollama may still be starting. Please wait a moment and try again.');
        resolve(false);
      });

    } catch (error) {
      logger.error('Error starting Ollama:', error);
      vscode.window.showErrorMessage('❌ Failed to start Ollama server');
      resolve(false);
    }
  });
}

async function getInstalledModels(): Promise<OllamaModel[]> {
  const config = vscode.workspace.getConfiguration('ollamaCodeFixer');
  let baseApiUrl = config.get<string>('ollamaApiUrl', 'http://localhost:11434');
  
  try {
    const urlObj = new URL(baseApiUrl);
    baseApiUrl = `${urlObj.protocol}//${urlObj.host}`;
  } catch (e) {
    baseApiUrl = 'http://localhost:11434';
  }

  try {
    const response = await axios.get(`${baseApiUrl}/api/tags`);
    return response.data?.models || [];
  } catch (error) {
    Logger.getInstance().error('Failed to fetch models:', error);
    return [];
  }
}

async function installModel(modelName: string): Promise<boolean> {
  const config = vscode.workspace.getConfiguration('ollamaCodeFixer');
  const ollamaPath = config.get<string>('ollamaPath', 'ollama');

  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Installing model: ${modelName}`,
      cancellable: true
    },
    async (progress, token) => {
      return new Promise<boolean>((resolve) => {
        const process = cp.spawn(ollamaPath, ['pull', modelName]);
        
        let output = '';
        
        process.stdout?.on('data', (data) => {
          output += data.toString();
          const lines = output.split('\n');
          const lastLine = lines[lines.length - 2] || '';
          
          if (lastLine.includes('%')) {
            const match = lastLine.match(/(\d+(?:\.\d+)?)%/);
            if (match) {
              const percentage = parseFloat(match[1]);
              progress.report({ 
                increment: percentage / 100 * 100,
                message: `${percentage.toFixed(1)}%`
              });
            }
          }
        });

        process.on('close', (code) => {
          if (code === 0) {
            vscode.window.showInformationMessage(`✅ Model ${modelName} installed successfully!`);
            resolve(true);
          } else {
            vscode.window.showErrorMessage(`❌ Failed to install model ${modelName}`);
            resolve(false);
          }
        });

        token.onCancellationRequested(() => {
          process.kill();
          resolve(false);
        });
      });
    }
  );
}

async function applyCodeChanges(
  editor: vscode.TextEditor,
  newCode: string,
  originalSelection: vscode.Selection,
  operation: OperationType
): Promise<void> {
  const config = vscode.workspace.getConfiguration('ollamaCodeFixer');
  const autoApply = config.get<boolean>('autoApplyChanges', false);
  const showPreview = config.get<boolean>('showPreviewBeforeApply', true);
  const insertPosition = config.get<string>('insertPosition', 'replace');
  const backupOriginal = config.get<boolean>('backupOriginalCode', true);

  // Создаем резервную копию если нужно
  if (backupOriginal && operation !== OperationType.EXPLAIN) {
    const originalCode = editor.document.getText(originalSelection);
    await vscode.env.clipboard.writeText(originalCode);
  }

  // Показываем превью если нужно
  if (showPreview && !autoApply && operation !== OperationType.EXPLAIN) {
    const choice = await showCodePreview(newCode, operation);
    if (choice !== 'Apply') {
      return;
    }
  }

  // Применяем изменения в зависимости от настройки позиции
  let success = false;
  
  if (operation === OperationType.EXPLAIN || operation === OperationType.SECURITY) {
    // Для объяснений показываем в отдельном документе
    await showResultInNewDocument(newCode, operation, editor.document.languageId);
    return;
  }

  switch (insertPosition) {
    case 'replace':
      success = await editor.edit(editBuilder => {
        editBuilder.replace(originalSelection, newCode);
      });
      break;
      
    case 'above':
      success = await editor.edit(editBuilder => {
        editBuilder.insert(originalSelection.start, newCode + '\n\n');
      });
      break;
      
    case 'below':
      success = await editor.edit(editBuilder => {
        editBuilder.insert(originalSelection.end, '\n\n' + newCode);
      });
      break;
      
    case 'newFile':
      await showResultInNewDocument(newCode, operation, editor.document.languageId);
      return;
  }

  if (success) {
    const operationNames = {
      [OperationType.FIX]: 'Fixed',
      [OperationType.OPTIMIZE]: 'Optimized', 
      [OperationType.COMMENT]: 'Commented',
      [OperationType.TEST]: 'Tests generated for',
      [OperationType.REFACTOR]: 'Refactored',
      [OperationType.SECURITY]: 'Security check completed for',
      [OperationType.GENERATE]: 'Generated',
      [OperationType.TRANSLATE]: 'Translated'
    };
    
    vscode.window.showInformationMessage(`✅ ${operationNames[operation]} code successfully!`);
    Logger.getInstance().info(`${operation} operation completed successfully.`);
  } else {
    vscode.window.showErrorMessage('❌ Failed to apply code changes.');
    Logger.getInstance().error(`Failed to apply ${operation} operation.`);
  }
}

async function showCodePreview(code: string, operation: OperationType): Promise<string | undefined> {
  const operationNames = {
    [OperationType.FIX]: 'Fixed Code',
    [OperationType.OPTIMIZE]: 'Optimized Code',
    [OperationType.COMMENT]: 'Commented Code',
    [OperationType.TEST]: 'Generated Tests',
    [OperationType.REFACTOR]: 'Refactored Code',
    [OperationType.SECURITY]: 'Security Analysis',
    [OperationType.GENERATE]: 'Generated Code',
    [OperationType.TRANSLATE]: 'Translated Code',
    [OperationType.EXPLAIN]: 'Code Explanation'
  };

  return vscode.window.showInformationMessage(
    `Preview ${operationNames[operation]}:\n\n${code.substring(0, 200)}${code.length > 200 ? '...' : ''}`,
    { modal: true },
    'Apply',
    'Cancel',
    'Show Full'
  );
}

async function showResultInNewDocument(content: string, operation: OperationType, languageId: string): Promise<void> {
  const operationExtensions = {
    [OperationType.EXPLAIN]: '.md',
    [OperationType.SECURITY]: '.md',
    [OperationType.TEST]: getTestExtension(languageId),
    [OperationType.FIX]: getFileExtension(languageId),
    [OperationType.OPTIMIZE]: getFileExtension(languageId),
    [OperationType.COMMENT]: getFileExtension(languageId),
    [OperationType.REFACTOR]: getFileExtension(languageId),
    [OperationType.GENERATE]: getFileExtension(languageId),
    [OperationType.TRANSLATE]: getFileExtension(languageId)
  };

  const extension = operationExtensions[operation];
  const fileName = `ollama-${operation}-result${extension}`;
  
  const document = await vscode.workspace.openTextDocument({
    content: content,
    language: operation === OperationType.EXPLAIN || operation === OperationType.SECURITY ? 'markdown' : languageId
  });
  
  await vscode.window.showTextDocument(document);
}

function getFileExtension(languageId: string): string {
  const extensions: { [key: string]: string } = {
    'javascript': '.js',
    'typescript': '.ts',
    'python': '.py',
    'java': '.java',
    'csharp': '.cs',
    'cpp': '.cpp',
    'c': '.c',
    'go': '.go',
    'rust': '.rs',
    'php': '.php',
    'ruby': '.rb',
    'swift': '.swift',
    'kotlin': '.kt',
    'scala': '.scala',
    'html': '.html',
    'css': '.css',
    'scss': '.scss',
    'less': '.less',
    'json': '.json',
    'xml': '.xml',
    'yaml': '.yaml',
    'sql': '.sql',
    'shell': '.sh',
    'powershell': '.ps1',
    'dockerfile': '.dockerfile',
    'makefile': '.makefile'
  };
  
  return extensions[languageId] || '.txt';
}

function getTestExtension(languageId: string): string {
  const testExtensions: { [key: string]: string } = {
    'javascript': '.test.js',
    'typescript': '.test.ts',
    'python': '_test.py',
    'java': 'Test.java',
    'csharp': '.Tests.cs',
    'cpp': '_test.cpp',
    'c': '_test.c',
    'go': '_test.go',
    'rust': '_test.rs',
    'php': 'Test.php',
    'ruby': '_test.rb',
    'swift': 'Tests.swift',
    'kotlin': 'Test.kt',
    'scala': 'Test.scala'
  };
  
  return testExtensions[languageId] || '.test.txt';
}

class FixerTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    command?: vscode.Command,
    iconPath?: string | vscode.ThemeIcon
  ) {
    super(label, collapsibleState);
    this.command = command;
    this.iconPath = iconPath;
  }
}

class OllamaCodeFixerViewProvider implements vscode.TreeDataProvider<FixerTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<FixerTreeItem | undefined | null | void> = new vscode.EventEmitter<FixerTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<FixerTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  getTreeItem(element: FixerTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FixerTreeItem): Thenable<FixerTreeItem[]> {
    if (element) {
      return Promise.resolve([]);
    }

    return Promise.resolve([
      new FixerTreeItem(
        '🔧 Fix Code',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.fixSelectedCode',
          title: 'Fix Code'
        },
        new vscode.ThemeIcon('wrench')
      ),
      new FixerTreeItem(
        '⚡ Optimize Code',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.optimizeCode',
          title: 'Optimize Code'
        },
        new vscode.ThemeIcon('zap')
      ),
      new FixerTreeItem(
        '📝 Explain Code',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.explainCode',
          title: 'Explain Code'
        },
        new vscode.ThemeIcon('info')
      ),
      new FixerTreeItem(
        '💬 Add Comments',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.generateComments',
          title: 'Add Comments'
        },
        new vscode.ThemeIcon('comment')
      ),
      new FixerTreeItem(
        '🧪 Generate Tests',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.generateTests',
          title: 'Generate Tests'
        },
        new vscode.ThemeIcon('beaker')
      ),
      new FixerTreeItem(
        '🔄 Refactor Code',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.refactorCode',
          title: 'Refactor Code'
        },
        new vscode.ThemeIcon('refresh')
      ),
      new FixerTreeItem(
        '🔒 Security Check',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.checkSecurity',
          title: 'Security Check'
        },
        new vscode.ThemeIcon('shield')
      ),
      new FixerTreeItem(
        '✨ Generate Code',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.generateCode',
          title: 'Generate Code'
        },
        new vscode.ThemeIcon('sparkle')
      ),
      new FixerTreeItem(
        '💬 Open AI Chat',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.openChat',
          title: 'Open Chat'
        },
        new vscode.ThemeIcon('comment-discussion')
      ),
      new FixerTreeItem(
        '📡 Check API Status',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.checkApiStatus',
          title: 'Check API Status'
        },
        new vscode.ThemeIcon('pulse')
      ),
      new FixerTreeItem(
        '🚀 Start Ollama',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.startOllama',
          title: 'Start Ollama'
        },
        new vscode.ThemeIcon('play')
      ),
      new FixerTreeItem(
        '🎯 Select Model',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.selectModel',
          title: 'Select Model'
        },
        new vscode.ThemeIcon('settings-gear')
      ),
      new FixerTreeItem(
        '📥 Install Model',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.installModel',
          title: 'Install Model'
        },
        new vscode.ThemeIcon('cloud-download')
      ),
      new FixerTreeItem(
        '📋 Show Models',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.showInstalledModels',
          title: 'Show Models'
        },
        new vscode.ThemeIcon('list-unordered')
      ),
      new FixerTreeItem(
        '🌐 Change Language',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ollama-code-fixer.changeLanguage',
          title: 'Change Language'
        },
        new vscode.ThemeIcon('globe')
      ),
      new FixerTreeItem(
        '⚙️ Settings',
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'workbench.action.openSettings',
          title: 'Open Settings',
          arguments: ['ollamaCodeFixer']
        },
        new vscode.ThemeIcon('gear')
      )
    ]);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

// Вспомогательная функция для создания команд операций
function createOperationCommand(operation: OperationType) {
  return async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('No active text editor.');
      return;
    }

    let selectedText: string;
    let selection: vscode.Selection;

    if (operation === OperationType.GENERATE) {
      // Для генерации кода запрашиваем описание
      const description = await vscode.window.showInputBox({
        prompt: 'Describe what code you want to generate:',
        placeHolder: 'e.g., "Create a function to sort an array of objects by date"'
      });
      
      if (!description) {
        return;
      }
      
      selectedText = description;
      selection = editor.selection;
    } else {
      selection = editor.selection;
      if (selection.isEmpty) {
        vscode.window.showInformationMessage('No text selected. Please select the code to process.');
        return;
      }
      selectedText = editor.document.getText(selection);
    }

    const languageId = editor.document.languageId;
    
    let targetLanguage: string | undefined;
    if (operation === OperationType.TRANSLATE) {
      const languages = [
        'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'c',
        'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala'
      ];
      
      targetLanguage = await vscode.window.showQuickPick(languages, {
        placeHolder: 'Select target programming language'
      });
      
      if (!targetLanguage) {
        return;
      }
    }

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Ollama AI: Processing ${operation}...`,
        cancellable: true,
      },
      async (progress, token) => {
        token.onCancellationRequested(() => {
          Logger.getInstance().info(`User cancelled the ${operation} operation.`);
          vscode.window.showInformationMessage(`${operation} operation cancelled.`);
        });

        progress.report({ increment: 0, message: `Sending to AI for ${operation}...` });

        if (token.isCancellationRequested) {
          return;
        }

        const result = await executeOllamaOperation(operation, selectedText, languageId, targetLanguage);

        if (token.isCancellationRequested) {
          return;
        }

        if (result === null) {
          return;
        }

        progress.report({ increment: 80, message: 'Applying AI suggestions...' });

        const currentEditor = vscode.window.activeTextEditor;
        const currentSelection = currentEditor?.selection;

        if (currentEditor && currentEditor.document === editor.document && currentSelection) {
          await applyCodeChanges(currentEditor, result, selection, operation);
        } else {
          vscode.window.showWarningMessage(
            'Editor selection or focus changed during AI processing. Result not applied automatically.'
          );
          await showResultInNewDocument(result, operation, languageId);
        }
        
        progress.report({ increment: 100, message: 'Finished.' });
      }
    );
  };
}

export function activate(context: vscode.ExtensionContext) {
  const logger = Logger.getInstance();
  logger.info("Ollama Code Fixer Agent activated.");

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = 'Ollama: Checking...';
  statusBarItem.command = 'ollama-code-fixer.checkApiStatus';
  statusBarItem.show();

  const retryManager = new RetryManager();
  const config = vscode.workspace.getConfiguration('ollamaCodeFixer');
  let baseUrl = config.get<string>('ollamaApiUrl', 'http://localhost:11434');

  try {
    const urlObj = new URL(baseUrl);
    baseUrl = `${urlObj.protocol}//${urlObj.host}`;
  } catch (e) {
    logger.error("Invalid ollamaApiUrl, using default base.", e);
    baseUrl = 'http://localhost:11434';
  }

  const checkApiStatus = async (autoStart: boolean = false) => {
    try {
      await retryManager.withRetry(async () => axios.get(baseUrl, { timeout: 5000 }));
      statusBarItem.text = '$(check) Ollama: Active';
      statusBarItem.tooltip = 'Ollama API is running - Click to check status';
      statusBarItem.backgroundColor = undefined;
      logger.info('Ollama API is active');
    } catch (error) {
      statusBarItem.text = '$(error) Ollama: Starting...';
      statusBarItem.tooltip = 'Starting Ollama server - Click to check status';
      statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');

      if (autoStart) {
        logger.info('Ollama not accessible, attempting auto-start...');
        const started = await startOllamaServer();
        
        if (started) {
          // Проверяем статус через 3 секунды после запуска
          setTimeout(() => checkApiStatus(false), 3000);
          return;
        }
      }

      statusBarItem.text = '$(error) Ollama: Offline';
      statusBarItem.tooltip = 'Ollama API is not accessible - Click to check status';
      statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');

      if (error instanceof AxiosError) {
        logger.error('API Status Check Error:', {
          message: error.message,
          code: error.code,
          response: error.response?.status
        });
      }
    }
  };

  // Проверяем статус и автозапускаем Ollama при первом запуске
  checkApiStatus(true);
  const statusCheckInterval = setInterval(() => checkApiStatus(false), 30000);

  const provider = new OllamaCodeFixerViewProvider();
  vscode.window.registerTreeDataProvider('ollamaCodeFixerView', provider);

  const chatProvider = new OllamaCodeFixerChatProvider(context.extensionUri);

  // Регистрируем все команды операций
  const operationCommands = [
    { command: 'ollama-code-fixer.fixSelectedCode', operation: OperationType.FIX },
    { command: 'ollama-code-fixer.optimizeCode', operation: OperationType.OPTIMIZE },
    { command: 'ollama-code-fixer.explainCode', operation: OperationType.EXPLAIN },
    { command: 'ollama-code-fixer.generateComments', operation: OperationType.COMMENT },
    { command: 'ollama-code-fixer.generateTests', operation: OperationType.TEST },
    { command: 'ollama-code-fixer.refactorCode', operation: OperationType.REFACTOR },
    { command: 'ollama-code-fixer.checkSecurity', operation: OperationType.SECURITY },
    { command: 'ollama-code-fixer.generateCode', operation: OperationType.GENERATE },
    { command: 'ollama-code-fixer.translateCode', operation: OperationType.TRANSLATE }
  ];

  const disposables = operationCommands.map(({ command, operation }) =>
    vscode.commands.registerCommand(command, createOperationCommand(operation))
  );

  // Дополнительные команды управления
  const additionalCommands = [
    vscode.commands.registerCommand('ollama-code-fixer.checkApiStatus', async () => {
      let baseUrl = getConfigOrThrow<string>('ollamaApiUrl', 'http://localhost:11434');
      
      try {
        const urlObj = new URL(baseUrl);
        baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      } catch (e) {
        logger.error("Invalid ollamaApiUrl for health check, using default base.", e);
        baseUrl = 'http://localhost:11434';
      }

      logger.info(`Checking API status at: ${baseUrl}`);

      try {
        await retryManager.withRetry(async () => {
          return axios.get(baseUrl, { timeout: 5000 });
        });
        
        vscode.window.showInformationMessage('✅ Ollama API is accessible!');
      } catch (error) {
        let statusMessage = '❌ Ollama API is not accessible.';
        
        if (error instanceof AxiosError) {
          if (error.response) {
            statusMessage += ` Status: ${error.response.status}`;
          } else if (error.request) {
            statusMessage += ' No response received.';
          } else {
            statusMessage += ` Error: ${error.message}`;
          }
        }
        
        logger.error('checkApiStatus Error:', error);
        const choice = await vscode.window.showErrorMessage(statusMessage, 'Start Ollama', 'Cancel');
        
        if (choice === 'Start Ollama') {
          await startOllamaServer();
        }
      }
    }),

    vscode.commands.registerCommand('ollama-code-fixer.startOllama', async () => {
      const started = await startOllamaServer();
      if (started) {
        setTimeout(checkApiStatus, 2000);
      }
    }),

    vscode.commands.registerCommand('ollama-code-fixer.selectModel', async () => {
      const models = await getInstalledModels();
      const config = vscode.workspace.getConfiguration('ollamaCodeFixer');
      const currentModel = config.get<string>('modelName', 'llama2');
      
      if (models.length === 0) {
        vscode.window.showErrorMessage('No models installed. Please install a model first.');
        return;
      }

      const modelItems = models.map(model => ({
        label: model.name,
        description: model.name === currentModel ? '(current)' : '',
        detail: `Size: ${(model.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
      }));

      const selected = await vscode.window.showQuickPick(modelItems, {
        placeHolder: 'Select a model to use',
        matchOnDescription: true,
        matchOnDetail: true
      });

      if (selected) {
        await config.update('modelName', selected.label, true);
        vscode.window.showInformationMessage(`✅ Model changed to: ${selected.label}`);
        provider.refresh();
      }
    }),

    vscode.commands.registerCommand('ollama-code-fixer.installModel', async () => {
      const config = vscode.workspace.getConfiguration('ollamaCodeFixer');
      const preferredModels = config.get<string[]>('preferredModels', [
        'codellama:13b', 'llama2:7b', 'mistral:7b', 'gemma:7b'
      ]);

      // Показываем список рекомендованных моделей + возможность ввести свою
      const modelOptions = [
        ...preferredModels.map(model => ({ label: model, description: 'Recommended' })),
        { label: '$(edit) Custom model...', description: 'Enter model name manually' }
      ];

      const selected = await vscode.window.showQuickPick(modelOptions, {
        placeHolder: 'Select a model to install',
        matchOnDescription: true
      });

      if (!selected) {
        return;
      }

      let modelName: string;

      if (selected.label.startsWith('$(edit)')) {
        const customModel = await vscode.window.showInputBox({
          prompt: 'Enter model name (e.g., llama2:7b, codellama:13b)',
          placeHolder: 'model-name:tag'
        });
        
        if (!customModel) {
          return;
        }
        
        modelName = customModel;
      } else {
        modelName = selected.label;
      }

      const success = await installModel(modelName);
      if (success) {
        provider.refresh();
      }
    }),

    vscode.commands.registerCommand('ollama-code-fixer.showInstalledModels', async () => {
      const models = await getInstalledModels();
      
      if (models.length === 0) {
        vscode.window.showInformationMessage('No models installed.');
        return;
      }

      const config = vscode.workspace.getConfiguration('ollamaCodeFixer');
      const currentModel = config.get<string>('modelName', 'llama2');

      const modelInfo = models.map(model => {
        const size = (model.size / (1024 * 1024 * 1024)).toFixed(2);
        const current = model.name === currentModel ? ' (current)' : '';
        return `• ${model.name}${current} - ${size} GB`;
      }).join('\n');

      vscode.window.showInformationMessage(
        `Installed Models:\n\n${modelInfo}`,
        { modal: true }
      );
    }),

    vscode.commands.registerCommand('ollama-code-fixer.openChat', () => {
      chatProvider.show();
    }),

    vscode.commands.registerCommand('ollama-code-fixer.changeLanguage', async () => {
      const config = vscode.workspace.getConfiguration('ollamaCodeFixer');
      const currentLanguage = config.get<string>('language', 'en');
      
      const languageOptions = [
        { label: '🇺🇸 English', value: 'en', description: currentLanguage === 'en' ? '(current)' : '' },
        { label: '🇷🇺 Русский', value: 'ru', description: currentLanguage === 'ru' ? '(current)' : '' },
        { label: '🇺🇦 Українська', value: 'uk', description: currentLanguage === 'uk' ? '(current)' : '' },
        { label: '🇪🇸 Español', value: 'es', description: currentLanguage === 'es' ? '(current)' : '' }
      ];

      const selected = await vscode.window.showQuickPick(languageOptions, {
        placeHolder: 'Select interface language / Выберите язык интерфейса / Оберіть мову інтерфейсу / Selecciona el idioma de la interfaz',
        matchOnDescription: true
      });

      if (selected && selected.value !== currentLanguage) {
        await config.update('language', selected.value, true);
        
        const messages = {
          'en': `✅ Language changed to English. Please reload the window to apply changes.`,
          'ru': `✅ Язык изменён на русский. Перезагрузите окно для применения изменений.`,
          'uk': `✅ Мову змінено на українську. Перезавантажте вікно для застосування змін.`,
          'es': `✅ Idioma cambiado a español. Recarga la ventana para aplicar los cambios.`
        };
        
        const reloadTexts = {
          'en': 'Reload Window',
          'ru': 'Перезагрузить окно',
          'uk': 'Перезавантажити вікно',
          'es': 'Recargar ventana'
        };
        
        const message = messages[selected.value as keyof typeof messages];
        const reloadText = reloadTexts[selected.value as keyof typeof reloadTexts];
        
        const choice = await vscode.window.showInformationMessage(message, reloadText);
        if (choice === reloadText) {
          vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
        
        provider.refresh();
      }
    })
  ];

  context.subscriptions.push(
    ...disposables,
    ...additionalCommands,
    statusBarItem,
    logger,
    { dispose: () => clearInterval(statusCheckInterval) }
  );

  // Показываем приветственное сообщение при первом запуске
  const hasShownWelcome = context.globalState.get('hasShownWelcome', false);
  if (!hasShownWelcome) {
    // Ждем 3 секунды, чтобы дать Ollama время запуститься
    setTimeout(() => {
      vscode.window.showInformationMessage(
        '🦙 Welcome to Ollama Code Fixer! Your AI coding assistant with auto-start is ready.',
        'Open Chat',
        'Try Demo',
        'Settings'
      ).then(choice => {
        if (choice === 'Open Chat') {
          chatProvider.show();
        } else if (choice === 'Try Demo') {
          vscode.commands.executeCommand('vscode.open', vscode.Uri.file('demo-code.js'));
        } else if (choice === 'Settings') {
          vscode.commands.executeCommand('workbench.action.openSettings', 'ollamaCodeFixer');
        }
      });
    }, 3000);
    
    context.globalState.update('hasShownWelcome', true);
  }
}

export function deactivate() {
  const logger = Logger.getInstance();
  logger.info("Ollama Code Fixer Agent deactivated.");
  logger.dispose();
}