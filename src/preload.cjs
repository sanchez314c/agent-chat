const { contextBridge, ipcRenderer } = require('electron')

// Define the API interface
const electronAPI = {
  // API Key management
  storeApiKey: (provider, key) => ipcRenderer.invoke('store-api-key', provider, key),
  getApiKey: (provider) => ipcRenderer.invoke('get-api-key', provider),
  deleteApiKey: (provider) => ipcRenderer.invoke('delete-api-key', provider),
  
  // File operations
  saveConversation: (content) => ipcRenderer.invoke('save-conversation', content),
  
  // Menu event listeners (return cleanup functions for React useEffect)
  onMenuNewConversation: (callback) => {
    ipcRenderer.removeAllListeners('menu-new-conversation')
    ipcRenderer.on('menu-new-conversation', callback)
    return () => ipcRenderer.removeListener('menu-new-conversation', callback)
  },
  onMenuSaveConversation: (callback) => {
    ipcRenderer.removeAllListeners('menu-save-conversation')
    ipcRenderer.on('menu-save-conversation', callback)
    return () => ipcRenderer.removeListener('menu-save-conversation', callback)
  },
  // Explicit cleanup for all menu listeners
  removeMenuListeners: () => {
    ipcRenderer.removeAllListeners('menu-new-conversation')
    ipcRenderer.removeAllListeners('menu-save-conversation')
  },
  
  // Utility
  platform: process.platform,

  // Window controls
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),

  // External links
  openExternal: (url) => ipcRenderer.invoke('open-external', url)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electronAPI = electronAPI
}