const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Ollama Code Fixer Extension Debug...');
console.log('📁 Working directory:', process.cwd());
console.log('📦 Extension path:', __dirname);

// Проверяем, что файлы скомпилированы
const fs = require('fs');
const distPath = path.join(__dirname, 'dist', 'extension.js');
const packagePath = path.join(__dirname, 'package.json');

if (!fs.existsSync(distPath)) {
    console.error('❌ Error: dist/extension.js not found. Running compilation...');
    const compile = spawn('npm', ['run', 'compile'], {
        stdio: 'inherit',
        shell: true,
        cwd: __dirname
    });
    
    compile.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Compilation successful, starting VS Code...');
            launchVSCode();
        } else {
            console.error('❌ Compilation failed with code:', code);
        }
    });
} else {
    console.log('✅ Extension compiled, starting VS Code...');
    launchVSCode();
}

function launchVSCode() {
    console.log('🔧 Launching VS Code Extension Host...');
    
    const vscode = spawn('code', [
        '--extensionDevelopmentPath=' + __dirname,
        '--new-window',
        '--disable-extensions'
    ], {
        stdio: 'inherit',
        shell: true,
        detached: false
    });

    vscode.on('close', (code) => {
        console.log('📝 VS Code closed with code:', code);
    });

    vscode.on('error', (error) => {
        console.error('❌ Failed to start VS Code:', error);
    });
} 