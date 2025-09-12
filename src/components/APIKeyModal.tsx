import React, { useState, useEffect } from 'react'
import { X, Key, Eye, EyeOff, Save, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { APIProvider } from '../types'
import { API_PROVIDERS } from '../services/APIClient'

interface APIKeyModalProps {
  provider: APIProvider
  onClose: () => void
  onSave: () => void
}

export function APIKeyModal({ provider, onClose, onSave }: APIKeyModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasExistingKey, setHasExistingKey] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const providerConfig = API_PROVIDERS[provider]

  useEffect(() => {
    loadExistingKey()
  }, [provider])

  const loadExistingKey = async () => {
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.getApiKey(provider)
        if (result.success && result.key) {
          setApiKey(result.key)
          setHasExistingKey(true)
        }
      } catch (error) {
        console.error('Failed to load existing API key:', error)
      }
    }
  }

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter an API key' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.storeApiKey(provider, apiKey)
        if (result.success) {
          setMessage({ type: 'success', text: 'API key saved successfully' })
          setHasExistingKey(true)
          setTimeout(() => {
            onSave()
          }, 1000)
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to save API key' })
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save API key' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!hasExistingKey) return

    if (!confirm('Are you sure you want to delete this API key?')) {
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.deleteApiKey(provider)
        if (result.success) {
          setApiKey('')
          setHasExistingKey(false)
          setMessage({ type: 'success', text: 'API key deleted successfully' })
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to delete API key' })
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete API key' })
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderInstructions = () => {
    switch (provider) {
      case APIProvider.OPENROUTER:
        return 'Get your API key from https://openrouter.ai/keys'
      case APIProvider.OPENAI:
        return 'Get your API key from https://platform.openai.com/api-keys'
      case APIProvider.ANTHROPIC:
        return 'Get your API key from https://console.anthropic.com/settings/keys'
      case APIProvider.GEMINI:
        return 'Get your API key from https://aistudio.google.com/app/apikey'
      default:
        return 'Enter your API key for this provider'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-lg border border-dark-700 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div className="flex items-center space-x-3">
            <Key className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold">Configure {providerConfig.name} API Key</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Instructions */}
          <div className="text-sm text-gray-400">
            {getProviderInstructions()}
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="input-field w-full pr-10"
                placeholder="Enter your API key..."
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-900/20 text-green-200 border border-green-700/50'
                : 'bg-red-900/20 text-red-200 border border-red-700/50'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Security Notice */}
          <div className="text-xs text-gray-500 bg-dark-900/50 p-3 rounded border border-dark-600">
            <strong>Security Notice:</strong> Your API key will be encrypted and stored securely on your local machine. It will never be transmitted to any server other than the chosen AI provider.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-dark-700">
          <div>
            {hasExistingKey && (
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="btn-danger flex items-center space-x-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !apiKey.trim()}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}