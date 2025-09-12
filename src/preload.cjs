const { contextBridge, ipcRenderer } = require('electron')

// Define the API interface
const electronAPI = {
  // API Key management
  storeApiKey: (provider, key) => ipcRenderer.invoke('store-api-key', provider, key),
  getApiKey: (provider) => ipcRenderer.invoke('get-api-key', provider),
  deleteApiKey: (provider) => ipcRenderer.invoke('delete-api-key', provider),
  
  // File operations
  saveConversation: (content) => ipcRenderer.invoke('save-conversation', content),
  
  // Menu event listeners
  onMenuNewConversation: (callback) => {
    ipcRenderer.on('menu-new-conversation', callback)
  },
  onMenuSaveConversation: (callback) => {
    ipcRenderer.on('menu-save-conversation', callback)
  },
  
  // Utility
  platform: process.platform
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