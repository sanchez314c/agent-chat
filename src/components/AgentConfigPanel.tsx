import React, { useState, useEffect } from 'react'
import { Settings, Bot, MessageSquare, Thermometer, Hash, Loader2, Send, Percent, Activity, Brain } from 'lucide-react'
import { APIProvider, type AgentConfig, ConversationState } from '../types'
import { API_PROVIDERS, APIClient } from '../services/APIClient'

interface AgentConfigPanelProps {
  agent1: AgentConfig
  agent2: AgentConfig
  systemPrompt: string
  initialPrompt: string
  onAgent1Change: (agent: AgentConfig) => void
  onAgent2Change: (agent: AgentConfig) => void
  onSystemPromptChange: (prompt: string) => void
  onInitialPromptChange: (prompt: string) => void
  onConfigureAPIKey: (provider: APIProvider) => void
  onInjectOperatorMessage?: (message: string) => void
  conversationState?: ConversationState
}

export function AgentConfigPanel({
  agent1,
  agent2,
  systemPrompt,
  initialPrompt,
  onAgent1Change,
  onAgent2Change,
  onSystemPromptChange,
  onInitialPromptChange,
  onConfigureAPIKey,
  onInjectOperatorMessage,
  conversationState
}: AgentConfigPanelProps) {
  const [operatorInput, setOperatorInput] = useState('')
  const [expandedAdvanced, setExpandedAdvanced] = useState<{ agent1: boolean; agent2: boolean }>({
    agent1: false,
    agent2: false
  })

  const handleInject = () => {
    if (operatorInput.trim() && onInjectOperatorMessage) {
      onInjectOperatorMessage(operatorInput.trim())
      setOperatorInput('')
    }
  }

  return (
    <div className="h-full flex flex-col bg-dark-800">
      {/* Header */}
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold">Agent Configuration</h2>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Agent 1 Configuration */}
        <AgentConfigSection
          agent={agent1}
          title="Agent 1"
          color="text-agent1"
          onChange={onAgent1Change}
          onConfigureAPIKey={onConfigureAPIKey}
          expanded={expandedAdvanced.agent1}
          onToggleExpanded={() => setExpandedAdvanced(prev => ({ ...prev, agent1: !prev.agent1 }))}
        />

        <div className="border-t border-dark-700 pt-6">
          {/* Agent 2 Configuration */}
          <AgentConfigSection
            agent={agent2}
            title="Agent 2"
            color="text-agent2"
            onChange={onAgent2Change}
            onConfigureAPIKey={onConfigureAPIKey}
            expanded={expandedAdvanced.agent2}
            onToggleExpanded={() => setExpandedAdvanced(prev => ({ ...prev, agent2: !prev.agent2 }))}
          />
        </div>

        <div className="border-t border-dark-700 pt-6">
          {/* System Prompt */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <label className="font-medium text-gray-200">System Prompt</label>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              className="input-field w-full h-20 resize-none font-mono text-sm"
              placeholder="Enter system prompt for the conversation..."
            />
          </div>

          {/* Initial Prompt */}
          <div className="space-y-3 mt-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <label className="font-medium text-gray-200">Initial Prompt</label>
            </div>
            <textarea
              value={initialPrompt}
              onChange={(e) => onInitialPromptChange(e.target.value)}
              className="input-field w-full h-20 resize-none font-mono text-sm"
              placeholder="Enter the initial message to start the conversation..."
            />
          </div>
        </div>

        {/* Operator Message Injection */}
        {onInjectOperatorMessage && (
          <div className="border-t border-dark-700 pt-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-gray-400" />
                <label className="font-medium text-gray-200">Operator Message Injection</label>
              </div>
              <div className="space-y-2">
                <textarea
                  value={operatorInput}
                  onChange={(e) => setOperatorInput(e.target.value)}
                  className="input-field w-full h-20 resize-none font-mono text-sm"
                  placeholder="Enter a message to inject to Agent 1..."
                  disabled={conversationState !== ConversationState.RUNNING && conversationState !== ConversationState.PAUSED}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Inject a message from the operator to steer the conversation
                  </p>
                  <button
                    onClick={handleInject}
                    disabled={!operatorInput.trim() || (conversationState !== ConversationState.RUNNING && conversationState !== ConversationState.PAUSED)}
                    className="btn-primary flex items-center space-x-2 text-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>Inject to Agent 1</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface AgentConfigSectionProps {
  agent: AgentConfig
  title: string
  color: string
  onChange: (agent: AgentConfig) => void
  onConfigureAPIKey: (provider: APIProvider) => void
  expanded: boolean
  onToggleExpanded: () => void
}

function AgentConfigSection({
  agent,
  title,
  color,
  onChange,
  onConfigureAPIKey,
  expanded,
  onToggleExpanded
}: AgentConfigSectionProps) {
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [apiClient] = useState(() => new APIClient())

  // Load models when provider changes
  useEffect(() => {
    loadModelsForProvider(agent.provider)
  }, [agent.provider])

  const loadModelsForProvider = async (provider: APIProvider) => {
    setIsLoadingModels(true)
    try {
      // Always try to fetch models, even without API key
      const models = await apiClient.fetchModelsForProvider(provider)
      console.log(`Loaded ${models.length} models for ${provider}:`, models)
      setAvailableModels(models)
      
      // If current model is not in the list, set to default
      if (models.length > 0 && !models.includes(agent.model)) {
        const defaultModel = API_PROVIDERS[provider].defaultModel
        const newModel = models.includes(defaultModel) ? defaultModel : models[0]
        onChange({
          ...agent,
          model: newModel
        })
      }
    } catch (error) {
      console.error('Failed to load models:', error)
      // Always use fallback models
      const fallbackModels = apiClient.getFallbackModels(provider)
      console.log(`Using ${fallbackModels.length} fallback models for ${provider}:`, fallbackModels)
      setAvailableModels(fallbackModels)
    } finally {
      setIsLoadingModels(false)
    }
  }

  const handleProviderChange = (provider: APIProvider) => {
    const config = API_PROVIDERS[provider]
    onChange({
      ...agent,
      provider,
      model: config.defaultModel
    })
  }

  const supportsAdvancedParams = (provider: APIProvider): boolean => {
    // Most providers support these parameters except for some
    const limitedProviders = [APIProvider.PI]
    return !limitedProviders.includes(provider)
  }

  const supportsReasoningEffort = (provider: APIProvider): boolean => {
    // Only certain providers support reasoning effort
    return [APIProvider.OPENAI, APIProvider.ANTHROPIC].includes(provider)
  }

  const isLocalProvider = (provider: APIProvider): boolean => {
    return [APIProvider.OLLAMA, APIProvider.LLAMACPP].includes(provider)
  }

  return (
    <div className="space-y-4">
      {/* Agent Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className={`w-4 h-4 ${color}`} />
          <h3 className={`font-medium ${color}`}>{title}</h3>
        </div>
      </div>

      {/* Agent Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Name</label>
        <input
          type="text"
          value={agent.name}
          onChange={(e) => onChange({ ...agent, name: e.target.value })}
          className="input-field w-full"
          placeholder="Agent name"
        />
      </div>

      {/* Provider Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">Provider</label>
          {API_PROVIDERS[agent.provider]?.requiresAuth && (
            <button
              onClick={() => onConfigureAPIKey(agent.provider)}
              className="text-xs text-primary-400 hover:text-primary-300"
            >
              Configure API Key
            </button>
          )}
        </div>
        <select
          value={agent.provider}
          onChange={(e) => handleProviderChange(e.target.value as APIProvider)}
          className="input-field w-full"
        >
          {Object.values(APIProvider).map((provider) => (
            <option key={provider} value={provider}>
              {API_PROVIDERS[provider].name}
            </option>
          ))}
        </select>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">Model</label>
          {isLoadingModels && (
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Loading models...</span>
            </div>
          )}
        </div>
        <select
          value={agent.model}
          onChange={(e) => onChange({ ...agent, model: e.target.value })}
          className="input-field w-full font-mono text-sm"
          disabled={isLoadingModels}
        >
          {isLoadingModels ? (
            <option value="">Loading models...</option>
          ) : availableModels.length > 0 ? (
            availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))
          ) : (
            <option value="">No models available</option>
          )}
        </select>
        {availableModels.length > 0 && !isLoadingModels && (
          <div className="text-xs text-gray-500">
            {availableModels.length} models available
          </div>
        )}
      </div>

      {/* Local Server Configuration */}
      {isLocalProvider(agent.provider) && (
        <div className="space-y-3 p-3 bg-dark-900/50 rounded border border-dark-600">
          <div className="text-sm font-medium text-gray-300">Local Server Configuration</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Host</label>
              <input
                type="text"
                value={agent.localServerConfig?.host || (agent.provider === APIProvider.OLLAMA ? 'localhost' : '0.0.0.0')}
                onChange={(e) => onChange({
                  ...agent,
                  localServerConfig: {
                    ...agent.localServerConfig,
                    host: e.target.value,
                    port: agent.localServerConfig?.port || (agent.provider === APIProvider.OLLAMA ? 11434 : 8080)
                  }
                })}
                className="input-field w-full text-xs"
                placeholder="localhost"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Port</label>
              <input
                type="number"
                value={agent.localServerConfig?.port || (agent.provider === APIProvider.OLLAMA ? 11434 : 8080)}
                onChange={(e) => onChange({
                  ...agent,
                  localServerConfig: {
                    ...agent.localServerConfig,
                    host: agent.localServerConfig?.host || (agent.provider === APIProvider.OLLAMA ? 'localhost' : '0.0.0.0'),
                    port: parseInt(e.target.value) || (agent.provider === APIProvider.OLLAMA ? 11434 : 8080)
                  }
                })}
                className="input-field w-full text-xs"
                placeholder={agent.provider === APIProvider.OLLAMA ? '11434' : '8080'}
              />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {agent.provider === APIProvider.OLLAMA 
              ? 'Default: localhost:11434 for Ollama' 
              : 'Default: 0.0.0.0:8080 for Llama.cpp server'
            }
          </div>
        </div>
      )}

      {/* Temperature */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-300">Temperature</label>
          </div>
          <span className="text-sm text-gray-400">{agent.temperature}</span>
        </div>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={agent.temperature}
          onChange={(e) => onChange({ ...agent, temperature: parseFloat(e.target.value) })}
          className="w-full accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Focused</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>

      {/* Max Tokens */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-300">Max Tokens</label>
          </div>
          <span className="text-sm text-gray-400">{agent.maxTokens}</span>
        </div>
        <input
          type="range"
          min="100"
          max="4000"
          step="100"
          value={agent.maxTokens}
          onChange={(e) => onChange({ ...agent, maxTokens: parseInt(e.target.value) })}
          className="w-full accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>100</span>
          <span>2000</span>
          <span>4000</span>
        </div>
      </div>

      {/* Advanced Parameters Toggle */}
      {supportsAdvancedParams(agent.provider) && (
        <button
          onClick={onToggleExpanded}
          className="w-full text-left p-2 rounded bg-dark-700 hover:bg-dark-600 transition-colors flex items-center justify-between"
        >
          <span className="text-sm font-medium text-gray-300">Advanced Parameters</span>
          <span className="text-gray-400">{expanded ? '−' : '+'}</span>
        </button>
      )}

      {/* Advanced Parameters */}
      {expanded && supportsAdvancedParams(agent.provider) && (
        <div className="space-y-4 pl-2 border-l-2 border-dark-600">
          {/* Top P */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-300">Top P</label>
              </div>
              <span className="text-sm text-gray-400">{agent.topP ?? 1.0}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={agent.topP ?? 1.0}
              onChange={(e) => onChange({ ...agent, topP: parseFloat(e.target.value) })}
              className="w-full accent-primary-500"
            />
            <div className="text-xs text-gray-500">Nucleus sampling threshold</div>
          </div>

          {/* Top K */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-300">Top K</label>
              </div>
              <span className="text-sm text-gray-400">{agent.topK ?? 40}</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={agent.topK ?? 40}
              onChange={(e) => onChange({ ...agent, topK: parseInt(e.target.value) })}
              className="w-full accent-primary-500"
            />
            <div className="text-xs text-gray-500">Number of tokens to consider</div>
          </div>

          {/* Presence Penalty */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Percent className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-300">Presence Penalty</label>
              </div>
              <span className="text-sm text-gray-400">{agent.presencePenalty ?? 0}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={agent.presencePenalty ?? 0}
              onChange={(e) => onChange({ ...agent, presencePenalty: parseFloat(e.target.value) })}
              className="w-full accent-primary-500"
            />
            <div className="text-xs text-gray-500">Encourage topic diversity</div>
          </div>

          {/* Frequency Penalty */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Percent className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-300">Frequency Penalty</label>
              </div>
              <span className="text-sm text-gray-400">{agent.frequencyPenalty ?? 0}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={agent.frequencyPenalty ?? 0}
              onChange={(e) => onChange({ ...agent, frequencyPenalty: parseFloat(e.target.value) })}
              className="w-full accent-primary-500"
            />
            <div className="text-xs text-gray-500">Reduce repetition</div>
          </div>

          {/* Reasoning Effort (for supported models) */}
          {supportsReasoningEffort(agent.provider) && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-300">Reasoning Effort</label>
              </div>
              <select
                value={agent.reasoningEffort || 'medium'}
                onChange={(e) => onChange({ ...agent, reasoningEffort: e.target.value })}
                className="input-field w-full"
              >
                <option value="low">Low - Faster responses</option>
                <option value="medium">Medium - Balanced</option>
                <option value="high">High - More thoughtful</option>
              </select>
              <div className="text-xs text-gray-500">Controls depth of reasoning</div>
            </div>
          )}
        </div>
      )}

      {/* Persona */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Persona</label>
        <textarea
          value={agent.persona}
          onChange={(e) => onChange({ ...agent, persona: e.target.value })}
          className="input-field w-full h-24 resize-none font-mono text-sm"
          placeholder="Describe the agent's personality and behavior..."
        />
      </div>
    </div>
  )
}