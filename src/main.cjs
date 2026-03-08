const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron')
const { join } = require('path')
const Store = require('electron-store')
const fs = require('fs')
const isDev = process.env.NODE_ENV === 'development'

// ── Platform-specific Chromium flags ──
// Must be set BEFORE app.ready — works in source AND packaged builds.
if (process.platform === 'linux') {
  // Required for transparent BrowserWindow on Linux compositors (X11/Wayland)
  app.commandLine.appendSwitch('enable-transparent-visuals');
  // Prevents transparency artifacts on some Linux DEs without disabling full GPU
  app.commandLine.appendSwitch('disable-gpu-compositing');
  // Electron sandbox fix — prevents "credentials.cc: Permission denied" crash on Linux
  app.commandLine.appendSwitch('no-sandbox');
}

// Initialize config store (no built-in encryption — we use safeStorage per-value instead)
let store
try {
  store = new Store({
    name: 'agentchat-config',
    clearInvalidConfig: true
  })
} catch (error) {
  console.error('Failed to initialize store, using fresh config:', error)
  const configPath = join(app.getPath('userData'), 'agentchat-config.json')
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath)
  }
  store = new Store({
    name: 'agentchat-config',
    clearInvalidConfig: true
  })
}

// Encrypt a value using OS-level encryption (safeStorage)
// Safe to call from IPC handlers — they only fire after app.ready
function encryptValue(plainText) {
  if (!plainText) return ''
  try {
    if (require('electron').safeStorage.isEncryptionAvailable()) {
      return require('electron').safeStorage.encryptString(plainText).toString('base64')
    }
  } catch (e) {
    console.warn('safeStorage not available, storing key with basic obfuscation')
  }
  // Fallback: base64 encode (not secure, but better than plaintext in the JSON)
  return 'b64:' + Buffer.from(plainText).toString('base64')
}

// Decrypt a value encrypted by encryptValue()
function decryptValue(encrypted) {
  if (!encrypted) return ''
  try {
    // Check for base64 fallback prefix
    if (typeof encrypted === 'string' && encrypted.startsWith('b64:')) {
      return Buffer.from(encrypted.slice(4), 'base64').toString('utf8')
    }
    // Try safeStorage decryption
    if (require('electron').safeStorage.isEncryptionAvailable()) {
      return require('electron').safeStorage.decryptString(Buffer.from(encrypted, 'base64'))
    }
  } catch (e) {
    console.warn('Failed to decrypt value:', e.message)
  }
  // If all decryption fails, return the raw value (might be a legacy unencrypted key)
  return encrypted
}

// One-time migration: re-encrypt existing plaintext keys with safeStorage
// and remove the legacy .key file
function migrateKeys() {
  try {
    const { safeStorage } = require('electron')
    if (!safeStorage.isEncryptionAvailable()) return

    const apiKeys = store.get('apiKeys')
    if (apiKeys && typeof apiKeys === 'object') {
      for (const [provider, value] of Object.entries(apiKeys)) {
        if (typeof value === 'string' && value.length > 0) {
          // If it looks like a raw API key (common prefixes or short enough to not be encrypted), re-encrypt it
          if (!value.startsWith('b64:') && (
            value.startsWith('sk-') || value.startsWith('xai-') ||
            value.startsWith('gsk_') || value.length < 200
          )) {
            store.set(`apiKeys.${provider}`, encryptValue(value))
          }
        }
      }
    }

    // Remove legacy plaintext encryption key file
    const keyPath = join(app.getPath('userData'), '.key')
    if (fs.existsSync(keyPath)) {
      fs.unlinkSync(keyPath)
      console.log('Removed legacy plaintext encryption key file')
    }
  } catch (e) {
    console.warn('Key migration failed:', e.message)
  }
}

if (!app.requestSingleInstanceLock()) {
  app.quit()
}

// Create the main application window
function createWindow() {
  // Configure icon path based on platform
  let iconPath
  if (process.platform === 'darwin') {
    iconPath = join(__dirname, '../resources/icons/icon.icns')
  } else if (process.platform === 'win32') {
    iconPath = join(__dirname, '../resources/icons/icon.ico')
  } else {
    iconPath = join(__dirname, '../resources/icons/icon.png')
  }

  const isMac = process.platform === 'darwin'

  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 950,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    frame: false,
    transparent: true,
    ...(isMac ? { titleBarStyle: 'hiddenInset' } : {}),
    backgroundColor: '#00000000',
    hasShadow: false,
    resizable: true,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    try {
      const parsed = new URL(details.url)
      if (['https:', 'http:'].includes(parsed.protocol)) {
        shell.openExternal(details.url)
      }
    } catch (e) {
      // Invalid URL, ignore
    }
    return { action: 'deny' }
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:58743')
    // DevTools disabled - use --dev flag with run script if needed
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/renderer/index.html'))
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  // Set app user model id for windows
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.agentchat.desktop')
  }

  // Hide the application menu bar completely
  Menu.setApplicationMenu(null)

  // Migrate existing API keys to safeStorage encryption
  migrateKeys()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Handle API key storage
const VALID_PROVIDERS = ['anthropic', 'openai', 'google', 'gemini', 'groq', 'together', 'deepseek', 'mistral', 'perplexity', 'openrouter', 'xai', 'cohere', 'meta', 'pi', 'moonshot', 'kimi', 'claude', 'huggingface', 'replicate', 'ollama', 'llamacpp']

ipcMain.handle('store-api-key', async (_, provider, key) => {
  try {
    if (!VALID_PROVIDERS.includes(provider.toLowerCase())) {
      return { success: false, error: 'Invalid provider' }
    }
    store.set(`apiKeys.${provider}`, encryptValue(key))
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-api-key', async (_, provider) => {
  try {
    if (!VALID_PROVIDERS.includes(provider.toLowerCase())) {
      return { success: false, error: 'Invalid provider' }
    }

    // Map provider names to environment variable names
    const envKeyMap = {
      'anthropic': 'ANTHROPIC_API_KEY',
      'openai': 'OPENAI_API_KEY',
      'google': 'GEMINI_API_KEY',
      'gemini': 'GEMINI_API_KEY',
      'groq': 'GROQ_API_KEY',
      'together': 'TOGETHER_AI_API_KEY',
      'deepseek': 'DEEPSEEK_API_KEY',
      'mistral': 'MISTRAL_API_KEY',
      'perplexity': 'PERPLEXITY_API_KEY',
      'openrouter': 'OPENROUTER_API_KEY',
      'xai': 'XAI_API_KEY',
      'cohere': 'COHERE_API_KEY',
      'meta': 'META_AI_API_KEY',
      'pi': 'PI_AI_API_KEY',
      'moonshot': 'MOONSHOT_API_KEY',
      'kimi': 'KIMI_API_KEY',
      'claude': 'CLAUDE_API_KEY'
    }

    // First check environment variables
    const envKey = envKeyMap[provider.toLowerCase()]
    if (envKey && process.env[envKey]) {
      return { success: true, key: process.env[envKey] }
    }

    // Fall back to stored key (decrypt from safeStorage)
    const key = store.get(`apiKeys.${provider}`)
    return { success: true, key: key ? decryptValue(key) : undefined }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('delete-api-key', async (_, provider) => {
  try {
    if (!VALID_PROVIDERS.includes(provider.toLowerCase())) {
      return { success: false, error: 'Invalid provider' }
    }
    store.delete(`apiKeys.${provider}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Window control IPC handlers
ipcMain.handle('window-minimize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.minimize()
})

ipcMain.handle('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.isMaximized() ? win.unmaximize() : win.maximize()
})

ipcMain.handle('window-close', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.close()
})

// Open external URLs with protocol validation
ipcMain.handle('open-external', async (_, url) => {
  try {
    const parsed = new URL(url)
    if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      await shell.openExternal(url)
    }
  } catch (e) {
    // Invalid URL, ignore
  }
})

// Handle file operations
ipcMain.handle('save-conversation', async (_, content) => {
  try {
    const result = await dialog.showSaveDialog({
      title: 'Save Conversation',
      defaultPath: `AgentCHAT-${new Date().toISOString().split('T')[0]}.md`,
      filters: [
        { name: 'Markdown Files', extensions: ['md'] },
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (!result.canceled && result.filePath) {
      const fsPromises = require('fs/promises')
      await fsPromises.writeFile(result.filePath, content, 'utf8')
      return { success: true, filePath: result.filePath }
    }
    
    return { success: false, cancelled: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
