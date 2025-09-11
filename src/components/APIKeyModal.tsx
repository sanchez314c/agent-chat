import React, { useState, useEffect, useRef } from 'react'
import { X, Key, Eye, EyeOff, Save, Trash2, CheckCircle, AlertCircle, Shield } from 'lucide-react'
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
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const providerConfig = API_PROVIDERS[provider]

  // M22: Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const loadExistingKey = async () => {
      if (window.electronAPI) {
        try {
          const result = await window.electronAPI.getApiKey(provider)
          if (result.success && result.key) {
            // H14: Don't store the full decrypted key in state — show masked placeholder
            setHasExistingKey(true)
          }
        } catch (error) {
          console.error('Failed to load existing API key:', error)
        }
      }
    }
    loadExistingKey()
  }, [provider])

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
          // H14: Clear the decrypted key from React state after successful save
          setApiKey('')
          saveTimeoutRef.current = setTimeout(() => {
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
    <div className="modal-overlay">
      <div className="neo-panel-elevated w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-noir-border/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-neo bg-cyber-400/10 flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(20, 184, 166, 0.2)' }}>
              <Key className="w-5 h-5 text-cyber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Configure API Key</h2>
              <p className="text-xs text-white/40">{providerConfig.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-neo bg-noir-surface flex items-center justify-center text-white/40 hover:text-white hover:bg-noir-elevated transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Instructions */}
          <div className="text-sm text-white/60">
            {getProviderInstructions()}
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="input-field w-full pr-12 font-mono text-sm"
                placeholder={hasExistingKey ? '••••••••••••••••••••••••' : 'Enter your API key...'}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-cyber-400 hover:bg-cyber-400/10 transition-all"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-center space-x-3 p-4 rounded-neo ${
              message.type === 'success'
                ? 'bg-status-optimal/10 border border-status-optimal/30'
                : 'bg-status-error/10 border border-status-error/30'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-status-optimal flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-status-error flex-shrink-0" />
              )}
              <span className={`text-sm ${message.type === 'success' ? 'text-status-optimal' : 'text-status-error'}`}>
                {message.text}
              </span>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-start space-x-3 p-4 neo-card bg-noir-deep/50">
            <Shield className="w-5 h-5 text-cyber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-white/70 mb-1">Security Notice</p>
              <p className="text-xs text-white/40">
                Your API key will be encrypted and stored securely on your local machine. It will never be transmitted to any server other than the chosen AI provider.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-noir-border/50">
          <div>
            {hasExistingKey && (
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="btn-danger flex items-center space-x-2 text-sm py-2 px-4"
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
              className="btn-secondary py-2 px-4"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !apiKey.trim()}
              className="btn-primary flex items-center space-x-2 py-2 px-4"
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
