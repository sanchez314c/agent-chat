import React, { useState, useEffect, useRef } from 'react'
import { Settings, Bot, MessageSquare, Thermometer, Hash, Loader2, Send, Percent, Activity, Brain, ChevronDown, ChevronUp, Zap, Server } from 'lucide-react'
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-noir-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-neo bg-cyber-400/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-cyber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Agent Configuration</h2>
            <p className="text-xs text-white/40">Configure AI agents and prompts</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Agent 1 Configuration */}
        <AgentConfigSection
          agent={agent1}
          title="Agent 1"
          accentColor="agent1"
          onChange={onAgent1Change}
          onConfigureAPIKey={onConfigureAPIKey}
          expanded={expandedAdvanced.agent1}
          onToggleExpanded={() => setExpandedAdvanced(prev => ({ ...prev, agent1: !prev.agent1 }))}
        />

        <div className="neo-divider" />

        {/* Agent 2 Configuration */}
        <AgentConfigSection
          agent={agent2}
          title="Agent 2"
          accentColor="agent2"
          onChange={onAgent2Change}
          onConfigureAPIKey={onConfigureAPIKey}
          expanded={expandedAdvanced.agent2}
          onToggleExpanded={() => setExpandedAdvanced(prev => ({ ...prev, agent2: !prev.agent2 }))}
        />

        <div className="neo-divider" />

        {/* System Prompt */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-cyber-400" />
            <label className="font-medium text-white">System Prompt</label>
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            className="input-field w-full h-24 resize-none font-mono text-sm"
            placeholder="Enter system prompt for the conversation..."
          />
        </div>

        {/* Initial Prompt */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-neon-400" />
            <label className="font-medium text-white">Initial Prompt</label>
          </div>
          <textarea
            value={initialPrompt}
            onChange={(e) => onInitialPromptChange(e.target.value)}
            className="input-field w-full h-24 resize-none font-mono text-sm"
            placeholder="Enter the initial message to start the conversation..."
          />
        </div>

        {/* Operator Message Injection */}
        {onInjectOperatorMessage && (
          <>
            <div className="neo-divider" />
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-neon-400" />
                <label className="font-medium text-white">Operator Injection</label>
                <span className="neo-badge-neon text-[10px]">LIVE</span>
              </div>
              <div className="space-y-3">
                <textarea
                  value={operatorInput}
                  onChange={(e) => setOperatorInput(e.target.value)}
                  className="input-field w-full h-20 resize-none font-mono text-sm"
                  placeholder="Enter a message to inject to Agent 1..."
                  disabled={conversationState !== ConversationState.RUNNING && conversationState !== ConversationState.PAUSED}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40">
                    Steer the conversation in real-time
                  </p>
                  <button
                    onClick={handleInject}
                    disabled={!operatorInput.trim() || (conversationState !== ConversationState.RUNNING && conversationState !== ConversationState.PAUSED)}
                    className="btn-primary flex items-center space-x-2 text-sm py-2 px-4"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Inject</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface AgentConfigSectionProps {
  agent: AgentConfig
  title: string
  accentColor: 'agent1' | 'agent2'
  onChange: (agent: AgentConfig) => void
  onConfigureAPIKey: (provider: APIProvider) => void
  expanded: boolean
  onToggleExpanded: () => void
}

function AgentConfigSection({
  agent,
  title,
  accentColor,
  onChange,
  onConfigureAPIKey,
  expanded,
  onToggleExpanded
}: AgentConfigSectionProps) {
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const apiClientRef = useRef(new APIClient())
  const apiClient = apiClientRef.current

  const colorClasses = {
    agent1: {
      text: 'text-agent1',
      bg: 'bg-agent1',
      bgLight: 'bg-agent1/10',
      border: 'border-agent1/30',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]'
    },
    agent2: {
      text: 'text-agent2',
      bg: 'bg-agent2',
      bgLight: 'bg-agent2/10',
      border: 'border-agent2/30',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]'
    }
  }

  const colors = colorClasses[accentColor]

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
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-neo ${colors.bgLight} ${colors.border} border flex items-center justify-center ${colors.glow}`}>
            <Bot className={`w-4 h-4 ${colors.text}`} />
          </div>
          <h3 className={`font-semibold ${colors.text}`}>{title}</h3>
        </div>
        <div className={`w-2 h-2 rounded-full ${colors.bg}`} style={{ boxShadow: `0 0 8px currentColor` }} />
      </div>

      {/* Agent Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/70">Name</label>
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
          <label className="block text-sm font-medium text-white/70">Provider</label>
          {API_PROVIDERS[agent.provider]?.requiresAuth && (
            <button
              onClick={() => onConfigureAPIKey(agent.provider)}
              className="text-xs text-cyber-400 hover:text-cyber-300 transition-colors"
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
          <label className="block text-sm font-medium text-white/70">Model</label>
          {isLoadingModels && (
            <div className="flex items-center space-x-1.5 text-xs text-cyber-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Loading...</span>
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
          <div className="text-xs text-white/30">
            {availableModels.length} models available
          </div>
        )}
      </div>

      {/* Local Server Configuration */}
      {isLocalProvider(agent.provider) && (
        <div className="space-y-3 p-4 neo-card">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-cyber-400" />
            <span className="text-sm font-medium text-white">Local Server</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Host</label>
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
                className="input-field w-full text-xs py-2"
                placeholder="localhost"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Port</label>
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
                className="input-field w-full text-xs py-2"
                placeholder={agent.provider === APIProvider.OLLAMA ? '11434' : '8080'}
              />
            </div>
          </div>
          <div className="text-xs text-white/30">
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
            <Thermometer className="w-4 h-4 text-status-warning" />
            <label className="text-sm font-medium text-white/70">Temperature</label>
          </div>
          <span className="text-sm font-mono text-cyber-400">{agent.temperature}</span>
        </div>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={agent.temperature}
          onChange={(e) => onChange({ ...agent, temperature: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/30">
          <span>Focused</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>

      {/* Max Tokens */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-neon-400" />
            <label className="text-sm font-medium text-white/70">Max Tokens</label>
          </div>
          <span className="text-sm font-mono text-cyber-400">{agent.maxTokens}</span>
        </div>
        <input
          type="range"
          min="100"
          max="4000"
          step="100"
          value={agent.maxTokens}
          onChange={(e) => onChange({ ...agent, maxTokens: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/30">
          <span>100</span>
          <span>2000</span>
          <span>4000</span>
        </div>
      </div>

      {/* Advanced Parameters Toggle */}
      {supportsAdvancedParams(agent.provider) && (
        <button
          onClick={onToggleExpanded}
          className="w-full neo-card flex items-center justify-between hover:border-cyber-400/30 transition-colors group"
        >
          <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Advanced Parameters</span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-cyber-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-cyber-400 transition-colors" />
          )}
        </button>
      )}

      {/* Advanced Parameters */}
      {expanded && supportsAdvancedParams(agent.provider) && (
        <div className="space-y-4 pl-4 border-l-2 border-cyber-400/20">
          {/* Top P */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-white/40" />
                <label className="text-sm font-medium text-white/70">Top P</label>
              </div>
              <span className="text-sm font-mono text-cyber-400">{agent.topP ?? 1.0}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={agent.topP ?? 1.0}
              onChange={(e) => onChange({ ...agent, topP: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-white/30">Nucleus sampling threshold</div>
          </div>

          {/* Top K */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-white/40" />
                <label className="text-sm font-medium text-white/70">Top K</label>
              </div>
              <span className="text-sm font-mono text-cyber-400">{agent.topK ?? 40}</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={agent.topK ?? 40}
              onChange={(e) => onChange({ ...agent, topK: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-white/30">Number of tokens to consider</div>
          </div>

          {/* Presence Penalty */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Percent className="w-4 h-4 text-white/40" />
                <label className="text-sm font-medium text-white/70">Presence Penalty</label>
              </div>
              <span className="text-sm font-mono text-cyber-400">{agent.presencePenalty ?? 0}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={agent.presencePenalty ?? 0}
              onChange={(e) => onChange({ ...agent, presencePenalty: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-white/30">Encourage topic diversity</div>
          </div>

          {/* Frequency Penalty */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Percent className="w-4 h-4 text-white/40" />
                <label className="text-sm font-medium text-white/70">Frequency Penalty</label>
              </div>
              <span className="text-sm font-mono text-cyber-400">{agent.frequencyPenalty ?? 0}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={agent.frequencyPenalty ?? 0}
              onChange={(e) => onChange({ ...agent, frequencyPenalty: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-white/30">Reduce repetition</div>
          </div>

          {/* Reasoning Effort (for supported models) */}
          {supportsReasoningEffort(agent.provider) && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-neon-400" />
                <label className="text-sm font-medium text-white/70">Reasoning Effort</label>
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
              <div className="text-xs text-white/30">Controls depth of reasoning</div>
            </div>
          )}
        </div>
      )}

      {/* Persona */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/70">Persona</label>
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
