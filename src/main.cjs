const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron')
const { join } = require('path')
const Store = require('electron-store')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

// Generate or retrieve a unique encryption key for this installation
function getEncryptionKey() {
  const keyPath = path.join(app.getPath('userData'), '.key')
  
  try {
    // Check if key already exists
    if (fs.existsSync(keyPath)) {
      const key = fs.readFileSync(keyPath, 'utf8')
      if (key && key.length > 0) {
        return key
      }
    }
    
    // Generate new key for first run
    const newKey = crypto.randomBytes(32).toString('hex')
    fs.writeFileSync(keyPath, newKey, { mode: 0o600 }) // Only owner can read/write
    return newKey
  } catch (error) {
    console.error('Failed to manage encryption key:', error)
    // Fallback to a generated key (not ideal but better than hardcoded)
    return crypto.randomBytes(32).toString('hex')
  }
}

// Initialize secure storage for API keys with error handling
let store
try {
  // Clear corrupted config if it exists
  const configPath = path.join(app.getPath('userData'), 'agentchat-config.json')
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf8')
      JSON.parse(content) // Test if it's valid JSON
    } catch (e) {
      console.log('Removing corrupted config file')
      fs.unlinkSync(configPath)
    }
  }
  
  store = new Store({
    encryptionKey: getEncryptionKey(),
    name: 'agentchat-config',
    clearInvalidConfig: true
  })
} catch (error) {
  console.error('Failed to initialize store, using fresh config:', error)
  // If store initialization fails, remove the config and try again
  const configPath = path.join(app.getPath('userData'), 'agentchat-config.json')
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath)
  }
  
  store = new Store({
    encryptionKey: getEncryptionKey(),
    name: 'agentchat-config',
    clearInvalidConfig: true
  })
}

// Disable GPU Acceleration for Windows 7
if (process.platform === 'win32') app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Create the main application window
function createWindow() {
  // Configure icon path based on platform
  let iconPath
  if (process.platform === 'darwin') {
    iconPath = join(__dirname, '../assets/icon.icns')
  } else if (process.platform === 'win32') {
    iconPath = join(__dirname, '../assets/icon.ico')
  } else {
    iconPath = join(__dirname, '../assets/icon.png')
  }

  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    autoHideMenuBar: false,
    titleBarStyle: 'default',
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
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
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

  // Create the application menu
  createMenu()

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
ipcMain.handle('store-api-key', async (_, provider, key) => {
  try {
    store.set(`apiKeys.${provider}`, key)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-api-key', async (_, provider) => {
  try {
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
      console.log(`Using ${provider} API key from environment variable`)
      return { success: true, key: process.env[envKey] }
    }
    
    // Fall back to stored key
    const key = store.get(`apiKeys.${provider}`)
    if (key) {
      console.log(`Using ${provider} API key from secure storage`)
    }
    return { success: true, key }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('delete-api-key', async (_, provider) => {
  try {
    store.delete(`apiKeys.${provider}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
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
      const fs = require('fs/promises')
      await fs.writeFile(result.filePath, content, 'utf8')
      return { success: true, filePath: result.filePath }
    }
    
    return { success: false, cancelled: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Conversation',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            if (focusedWindow) {
              focusedWindow.webContents.send('menu-new-conversation')
            }
          }
        },
        {
          label: 'Save Conversation',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            if (focusedWindow) {
              focusedWindow.webContents.send('menu-save-conversation')
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About AgentCHAT',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'About AgentCHAT',
              message: 'AgentCHAT v1.0.0',
              detail: 'Multi-Agent AI Conversation Desktop App\nBuilt with Electron + React + TypeScript'
            })
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })

    // Window menu
    template[4].submenu.push(
      { type: 'separator' },
      { role: 'front' },
      { type: 'separator' },
      { role: 'window' }
    )
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}