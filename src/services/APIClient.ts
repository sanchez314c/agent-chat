import { APIProvider, type Message, type APIResponse } from '../types'

export interface APIProviderConfig {
  name: string
  baseUrl: string | ((model?: string, config?: any) => string) // Can be dynamic for some providers
  defaultModel: string
  models: string[]
  headers: (apiKey: string) => Record<string, string>
  transformRequest: (messages: Message[], model: string, maxTokens: number, temperature: number, additionalParams?: any) => any
  transformResponse: (response: any) => string
  supportsStreaming?: boolean
  asyncPolling?: boolean
  requiresAuth: boolean
}

// Validate that local server config points to localhost only (SSRF prevention)
function validateLocalServer(config: any): boolean {
  const allowedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]']
  return allowedHosts.includes(config?.host) &&
         Number.isInteger(config?.port) &&
         config.port > 0 && config.port <= 65535
}

// Strip internal fields from additionalParams before sending to third-party APIs
function sanitizeParams(additionalParams?: any): Record<string, any> {
  if (!additionalParams) return {}
  const { localServerConfig, provider, model, apiKey, ...safeParams } = additionalParams
  return safeParams
}

export const API_PROVIDERS: Record<APIProvider, APIProviderConfig> = {
  [APIProvider.OPENROUTER]: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    defaultModel: 'meta-llama/llama-3.1-8b-instruct:free',
    models: [],
    requiresAuth: true,
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://agentchat.local',
      'X-Title': 'AgentCHAT'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => ({
      model,
      messages: messages.map(msg => ({
        role: msg.role === 'operator' ? 'user' : msg.role,
        content: msg.content
      })),
      max_tokens: maxTokens,
      temperature,
      stream: false,
      ...sanitizeParams(additionalParams)
    }),
    transformResponse: (response) => response.choices[0]?.message?.content || ''
  },

  [APIProvider.OPENAI]: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o-mini',
    models: [],
    requiresAuth: true,
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => ({
      model,
      messages: messages.map(msg => ({
        role: msg.role === 'operator' ? 'user' : msg.role,
        content: msg.content
      })),
      max_tokens: maxTokens,
      temperature,
      stream: false,
      ...sanitizeParams(additionalParams)
    }),
    transformResponse: (response) => response.choices[0]?.message?.content || ''
  },

  [APIProvider.ANTHROPIC]: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1/messages',
    defaultModel: 'claude-3-5-sonnet-20241022',
    models: [],
    requiresAuth: true,
    headers: (apiKey: string) => ({
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => {
      const systemMessage = messages.find(m => m.role === 'system')
      const conversationMessages = messages.filter(m => m.role !== 'system')

      // [H8] Anthropic rejects consecutive same-role messages - merge them
      const mapped = conversationMessages.map(msg => ({
        role: (msg.role === 'assistant' ? 'assistant' : 'user') as string,
        content: msg.content
      }))
      const merged: { role: string; content: string }[] = []
      for (const msg of mapped) {
        if (merged.length > 0 && merged[merged.length - 1].role === msg.role) {
          merged[merged.length - 1].content += '\n\n' + msg.content
        } else {
          merged.push({ ...msg })
        }
      }

      return {
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemMessage?.content || '',
        messages: merged,
        ...sanitizeParams(additionalParams)
      }
    },
    transformResponse: (response) => response.content[0]?.text || ''
  },

  [APIProvider.GEMINI]: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    defaultModel: 'gemini-1.5-flash',
    models: [],
    requiresAuth: true,
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => {
      const systemMessages = messages.filter(m => m.role === 'system')
      const contents = messages
        .filter(m => m.role !== 'system')
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))

      // [C5] Gemini uses camelCase params - map explicitly instead of spreading snake_case
      const sanitized = sanitizeParams(additionalParams)
      const geminiConfig: any = {
        maxOutputTokens: maxTokens,
        temperature,
      }
      if (sanitized.top_k !== undefined) geminiConfig.topK = sanitized.top_k
      if (sanitized.top_p !== undefined) geminiConfig.topP = sanitized.top_p
      // presence_penalty, frequency_penalty, reasoning_effort are not supported by Gemini

      const request: any = {
        contents,
        generationConfig: geminiConfig
      }

      // Use Gemini's systemInstruction field instead of dropping system messages
      if (systemMessages.length > 0) {
        request.systemInstruction = {
          parts: systemMessages.map(m => ({ text: m.content }))
        }
      }

      return request
    },
    transformResponse: (response) => response.candidates[0]?.content?.parts[0]?.text || ''
  },

  [APIProvider.DEEPSEEK]: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1/chat/completions',
    defaultModel: 'deepseek-chat',
    models: [],
    requiresAuth: true,
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => ({
      model,
      messages: messages.map(msg => ({
        role: msg.role === 'operator' ? 'user' : msg.role,
        content: msg.content
      })),
      max_tokens: maxTokens,
      temperature,
      stream: false,
      ...sanitizeParams(additionalParams)
    }),
    transformResponse: (response) => response.choices[0]?.message?.content || ''
  },

  [APIProvider.GROQ]: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    defaultModel: 'llama3-8b-8192',
    models: [],
    requiresAuth: true,
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => ({
      model,
      messages: messages.map(msg => ({
        role: msg.role === 'operator' ? 'user' : msg.role,
        content: msg.content
      })),
      max_tokens: maxTokens,
      temperature,
      stream: false,
      ...sanitizeParams(additionalParams)
    }),
    transformResponse: (response) => response.choices[0]?.message?.content || ''
  },

  [APIProvider.HUGGINGFACE]: {
    name: 'HuggingFace',
    baseUrl: (model?: string) => {
      const modelName = model || 'meta-llama/Llama-2-7b-chat-hf'
      if (modelName.includes('..')) {
        throw new Error('Invalid model name: path traversal detected')
      }
      return `https://api-inference.huggingface.co/models/${modelName}`
    },
    defaultModel: 'meta-llama/Llama-2-7b-chat-hf',
    models: [],
    requiresAuth: true,
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => {
      // HuggingFace has a simpler format
      const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n')
      return {
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature,
          return_full_text: false,
          ...sanitizeParams(additionalParams)
        }
      }
    },
    transformResponse: (response) => {
      if (Array.isArray(response)) {
        return response[0]?.generated_text || ''
      }
      return response.generated_text || ''
    }
  },

  [APIProvider.META]: {
    name: 'Meta (via Replicate)',
    baseUrl: 'https://api.replicate.com/v1/predictions',
    defaultModel: 'meta/llama-2-70b-chat',
    models: [],
    requiresAuth: true,
    asyncPolling: true,
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'wait'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => {
      const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n')
      return {
        model,
        input: {
          prompt,
          max_new_tokens: maxTokens,
          temperature,
          ...sanitizeParams(additionalParams)
        }
      }
    },
    transformResponse: (response) => {
      if (Array.isArray(response.output)) {
        return response.output.join('')
      }
      if (typeof response.output === 'string') {
        return response.output
      }
      return ''
    }
  },

  [APIProvider.MISTRAL]: {
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1/chat/completions',
    defaultModel: 'mistral-small-latest',
    models: [],
    requiresAuth: true,
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => ({
      model,
      messages: messages.map(msg => ({
        role: msg.role === 'operator' ? 'user' : msg.role,
        content: msg.content
      })),
      max_tokens: maxTokens,
      temperature,
      stream: false,
      ...sanitizeParams(additionalParams)
    }),
    transformResponse: (response) => response.choices[0]?.message?.content || ''
  },

  [APIProvider.PI]: {
    name: 'Pi.ai',
    baseUrl: 'https://api.pi.ai/v1/chat',
    defaultModel: 'pi',
    models: ['pi'],
    requiresAuth: true,
    headers: (apiKey: string) => ({
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => ({
      messages: messages.map(msg => ({
        role: msg.role === 'operator' ? 'user' : msg.role,
        content: msg.content
      })),
      ...sanitizeParams(additionalParams)
    }),
    transformResponse: (response) => response.message || ''
  },

  [APIProvider.TOGETHER]: {
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1/chat/completions',
    defaultModel: 'meta-llama/Llama-3-70b-chat-hf',
    models: [],
    requiresAuth: true,
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => ({
      model,
      messages: messages.map(msg => ({
        role: msg.role === 'operator' ? 'user' : msg.role,
        content: msg.content
      })),
      max_tokens: maxTokens,
      temperature,
      stream: false,
      ...sanitizeParams(additionalParams)
    }),
    transformResponse: (response) => response.choices[0]?.message?.content || ''
  },

  [APIProvider.XAI]: {
    name: 'xAI (Grok)',
    baseUrl: 'https://api.x.ai/v1/chat/completions',
    defaultModel: 'grok-1',
    models: ['grok-1', 'grok-2'],
    requiresAuth: true,
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => ({
      model,
      messages: messages.map(msg => ({
        role: msg.role === 'operator' ? 'user' : msg.role,
        content: msg.content
      })),
      max_tokens: maxTokens,
      temperature,
      stream: false,
      ...sanitizeParams(additionalParams)
    }),
    transformResponse: (response) => response.choices[0]?.message?.content || ''
  },

  [APIProvider.OLLAMA]: {
    name: 'Ollama (Local)',
    baseUrl: (model?: string, config?: any) => {
      const lsc = config?.localServerConfig
      if (lsc && !validateLocalServer(lsc)) {
        throw new Error('Invalid local server config: host must be localhost/127.0.0.1/::1 and port must be 1-65535')
      }
      const host = lsc?.host || 'localhost'
      const port = lsc?.port || 11434
      return `http://${host}:${port}/api/chat`
    },
    defaultModel: 'llama3.2',
    models: [],
    requiresAuth: false,
    headers: () => ({
      'Content-Type': 'application/json'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => ({
      model,
      messages: messages.map(msg => ({
        role: msg.role === 'operator' ? 'user' : msg.role,
        content: msg.content
      })),
      stream: false,
      options: {
        num_predict: maxTokens,
        temperature,
        ...sanitizeParams(additionalParams)
      }
    }),
    transformResponse: (response) => response.message?.content || ''
  },

  [APIProvider.LLAMACPP]: {
    name: 'Llama.cpp (Local)',
    baseUrl: (model?: string, config?: any) => {
      const lsc = config?.localServerConfig
      if (lsc && !validateLocalServer(lsc)) {
        throw new Error('Invalid local server config: host must be localhost/127.0.0.1/::1 and port must be 1-65535')
      }
      const host = lsc?.host || 'localhost'
      const port = lsc?.port || 8080
      return `http://${host}:${port}/v1/chat/completions`
    },
    defaultModel: 'local-model',
    models: ['local-model'],
    requiresAuth: false,
    headers: () => ({
      'Content-Type': 'application/json'
    }),
    transformRequest: (messages, model, maxTokens, temperature, additionalParams) => {
      // Filter out system messages and ensure proper role alternation
      const conversationMessages = messages.filter(msg => msg.role !== 'system')
      const fixedMessages: any[] = []
      let lastRole = null
      
      for (const msg of conversationMessages) {
        const role = msg.role === 'operator' ? 'user' : msg.role
        
        if (role === lastRole && fixedMessages.length > 0) {
          // Merge with previous message if same role
          fixedMessages[fixedMessages.length - 1].content += '\n\n' + msg.content
        } else {
          fixedMessages.push({
            role,
            content: msg.content
          })
          lastRole = role
        }
      }
      
      // Ensure it starts with user if we have messages
      if (fixedMessages.length > 0 && fixedMessages[0].role === 'assistant') {
        fixedMessages.unshift({
          role: 'user',
          content: 'Hello, please respond to my message.'
        })
      }
      
      return {
        messages: fixedMessages,
        max_tokens: maxTokens,
        temperature,
        stream: false,
        ...sanitizeParams(additionalParams)
      }
    },
    transformResponse: (response) => response.choices[0]?.message?.content || ''
  }
}

export class APIClient {
  private modelCache: Map<APIProvider, string[]> = new Map()
  private modelsLoading: Set<APIProvider> = new Set()

  private async getAPIKey(provider: APIProvider): Promise<string> {
    // Local providers don't need API keys
    if (!API_PROVIDERS[provider].requiresAuth) {
      return ''
    }

    if (window.electronAPI) {
      const result = await window.electronAPI.getApiKey(provider)
      if (result.success && result.key) {
        return result.key
      }
    }
    throw new Error(`No API key found for ${provider}`)
  }

  // Fallback models for when API calls fail
  getFallbackModels(provider: APIProvider): string[] {
    switch (provider) {
      case APIProvider.OPENROUTER:
        return [
          'meta-llama/llama-3.1-8b-instruct:free',
          'meta-llama/llama-3.1-70b-instruct:free',
          'microsoft/wizardlm-2-8x22b',
          'google/gemma-2-9b-it:free',
          'mistralai/mistral-7b-instruct:free'
        ]
      case APIProvider.OPENAI:
        return [
          'gpt-4o',
          'gpt-4o-2024-11-20',
          'gpt-4o-2024-08-06',
          'gpt-4o-2024-05-13',
          'gpt-4o-mini',
          'gpt-4o-mini-2024-07-18',
          'gpt-4-turbo',
          'gpt-4-turbo-2024-04-09',
          'gpt-4-turbo-preview',
          'gpt-4-0125-preview',
          'gpt-4-1106-preview',
          'gpt-4',
          'gpt-4-0613',
          'gpt-3.5-turbo',
          'gpt-3.5-turbo-0125',
          'gpt-3.5-turbo-1106',
          'gpt-3.5-turbo-16k',
          'o1-preview',
          'o1-preview-2024-09-12',
          'o1-mini',
          'o1-mini-2024-09-12'
        ]
      case APIProvider.ANTHROPIC:
        return [
          'claude-sonnet-4',
          'claude-opus-4',
          'claude-3-5-sonnet-20241022',
          'claude-3-5-haiku-20241022',
          'claude-3-opus-20240229',
          'claude-3-sonnet-20240229',
          'claude-3-haiku-20240307',
          'claude-3-5-sonnet-latest',
          'claude-3-5-haiku-latest',
          'claude-3-opus-latest',
          'claude-3-sonnet-latest',
          'claude-3-haiku-latest',
          'claude-2.1',
          'claude-2.0',
          'claude-instant-1.2',
          'claude-instant-1.2-100k'
        ]
      case APIProvider.GEMINI:
        return [
          'gemini-2.5-pro',
          'gemini-2.5-pro-experimental',
          'gemini-2.5-pro-preview-06-05',
          'gemini-2.5-pro-preview-05-06',
          'gemini-2.5-flash',
          'gemini-2.5-flash-lite',
          'gemini-2.5-flash-lite-preview-06-17',
          'gemini-2.0-flash',
          'gemini-2.0-flash-experimental',
          'gemini-2.0-flash-lite',
          'gemini-2.0-flash-exp',
          'gemini-1.5-pro',
          'gemini-1.5-pro-002',
          'gemini-1.5-pro-001',
          'gemini-1.5-pro-latest',
          'gemini-1.5-flash',
          'gemini-1.5-flash-002',
          'gemini-1.5-flash-001',
          'gemini-1.5-flash-latest',
          'gemini-1.5-flash-8b',
          'gemini-1.5-flash-8b-latest',
          'gemini-1.0-pro',
          'gemini-1.0-pro-latest',
          'gemini-1.0-pro-001',
          'gemini-pro',
          'gemini-pro-vision',
          'gemma-3-4b',
          'gemma-3-4b-free',
          'gemma-3n-2b',
          'gemma-3n-2b-free',
          'gemma-3n-4b',
          'gemma-3n-4b-free',
          'gemma-3-12b',
          'gemma-3-12b-free',
          'gemma-3-27b',
          'gemma-3-27b-free',
          'gemma-2-27b',
          'gemma-2-9b',
          'gemma-2-9b-free'
        ]
      case APIProvider.DEEPSEEK:
        return ['deepseek-chat', 'deepseek-coder']
      case APIProvider.GROQ:
        return [
          'llama3-70b-8192',
          'llama3-8b-8192',
          'mixtral-8x7b-32768',
          'gemma-7b-it'
        ]
      case APIProvider.HUGGINGFACE:
        return [
          'meta-llama/Llama-2-7b-chat-hf',
          'meta-llama/Llama-2-13b-chat-hf',
          'mistralai/Mistral-7B-Instruct-v0.1',
          'google/flan-t5-xxl'
        ]
      case APIProvider.META:
        return ['meta/llama-2-70b-chat', 'meta/llama-2-13b-chat', 'meta/llama-2-7b-chat']
      case APIProvider.MISTRAL:
        return ['mistral-small-latest', 'mistral-medium-latest', 'mistral-large-latest']
      case APIProvider.PI:
        return ['pi']
      case APIProvider.TOGETHER:
        return [
          'meta-llama/Llama-3-70b-chat-hf',
          'meta-llama/Llama-3-8b-chat-hf',
          'mistralai/Mixtral-8x7B-Instruct-v0.1',
          'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'
        ]
      case APIProvider.XAI:
        return ['grok-1', 'grok-2']
      case APIProvider.OLLAMA:
        return ['llama3.2', 'llama3.1', 'mistral', 'phi3', 'qwen2.5']
      case APIProvider.LLAMACPP:
        return ['local-model']
      default:
        return []
    }
  }

  async fetchModelsForProvider(provider: APIProvider, localServerConfig?: { host?: string; port?: number }): Promise<string[]> {
    // Return cached models if available
    if (this.modelCache.has(provider)) {
      return this.modelCache.get(provider)!
    }

    // If already loading, return fallback models for now
    if (this.modelsLoading.has(provider)) {
      return this.getFallbackModels(provider)
    }

    this.modelsLoading.add(provider)

    try {
      let models: string[] = []

      switch (provider) {
        case APIProvider.OPENROUTER:
          models = await this.fetchOpenRouterModels()
          break
        case APIProvider.OPENAI:
          models = await this.fetchOpenAIModels()
          break
        case APIProvider.ANTHROPIC:
          models = await this.fetchAnthropicModels()
          break
        case APIProvider.GEMINI:
          models = await this.fetchGeminiModels()
          break
        case APIProvider.DEEPSEEK:
          models = await this.fetchDeepSeekModels()
          break
        case APIProvider.GROQ:
          models = await this.fetchGroqModels()
          break
        case APIProvider.HUGGINGFACE:
          models = await this.fetchHuggingFaceModels()
          break
        case APIProvider.TOGETHER:
          models = await this.fetchTogetherModels()
          break
        case APIProvider.OLLAMA:
          // [H4] Pass custom host/port if provided via localServerConfig
          models = await this.fetchOllamaModels(localServerConfig?.host, localServerConfig?.port)
          break
        case APIProvider.MISTRAL:
          models = await this.fetchMistralModels()
          break
        case APIProvider.META:
        case APIProvider.PI:
        case APIProvider.XAI:
        case APIProvider.LLAMACPP:
          // These don't have public model endpoints
          models = this.getFallbackModels(provider)
          break
      }

      if (models.length > 0) {
        this.modelCache.set(provider, models)
        API_PROVIDERS[provider].models = models
        return models
      }
    } catch (error) {
      console.warn(`Failed to fetch models for ${provider}:`, error)
    } finally {
      this.modelsLoading.delete(provider)
    }

    // Always return fallback models if we have none
    const fallback = this.getFallbackModels(provider)
    this.modelCache.set(provider, fallback)
    API_PROVIDERS[provider].models = fallback
    return fallback
  }

  private async fetchOpenRouterModels(): Promise<string[]> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const models = data.data
        .map((model: any) => model.id)
        .filter((id: string) => id && typeof id === 'string')
        .sort()

      return models
    } catch (error) {
      console.warn('OpenRouter models fetch failed:', error)
      return []
    }
  }

  private async fetchOpenAIModels(): Promise<string[]> {
    try {
      // OpenAI requires API key for models endpoint
      let apiKey = ''
      try {
        apiKey = await this.getAPIKey(APIProvider.OPENAI)
      } catch {
        // If no API key, return fallback models
        return this.getFallbackModels(APIProvider.OPENAI)
      }
      
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const models = data.data
        .map((model: any) => model.id)
        .filter((id: string) => id && (id.includes('gpt') || id.includes('o1')))
        .sort((a: string, b: string) => {
          // Sort to put newer models first
          if (a.includes('4o') && !b.includes('4o')) return -1
          if (!a.includes('4o') && b.includes('4o')) return 1
          if (a.includes('o1') && !b.includes('o1')) return -1
          if (!a.includes('o1') && b.includes('o1')) return 1
          return a.localeCompare(b)
        })

      return models.length > 0 ? models : this.getFallbackModels(APIProvider.OPENAI)
    } catch (error) {
      console.warn('OpenAI models fetch failed:', error)
      return this.getFallbackModels(APIProvider.OPENAI)
    }
  }

  private async fetchAnthropicModels(): Promise<string[]> {
    // Anthropic doesn't have a public models endpoint, return all available models
    return this.getFallbackModels(APIProvider.ANTHROPIC)
  }

  private async fetchGeminiModels(): Promise<string[]> {
    try {
      // Gemini has a public endpoint for listing models
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const models = data.models
        .map((model: any) => model.name.replace('models/', ''))
        .filter((name: string) => name && (name.toLowerCase().includes('gemini') || name.toLowerCase().includes('gemma')))
        .sort((a: string, b: string) => {
          // Sort to put newer models first
          if (a.includes('2.') && !b.includes('2.')) return -1
          if (!a.includes('2.') && b.includes('2.')) return 1
          return a.localeCompare(b)
        })

      return models.length > 0 ? models : this.getFallbackModels(APIProvider.GEMINI)
    } catch (error) {
      console.warn('Gemini models fetch failed:', error)
      return this.getFallbackModels(APIProvider.GEMINI)
    }
  }

  private async fetchDeepSeekModels(): Promise<string[]> {
    try {
      // Try to get API key but don't fail if missing
      let apiKey = ''
      try {
        apiKey = await this.getAPIKey(APIProvider.DEEPSEEK)
      } catch {
        // If no API key, return fallback models
        return this.getFallbackModels(APIProvider.DEEPSEEK)
      }
      
      const response = await fetch('https://api.deepseek.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const models = data.data.map((model: any) => model.id).sort()
      return models.length > 0 ? models : this.getFallbackModels(APIProvider.DEEPSEEK)
    } catch (error) {
      console.warn('DeepSeek models fetch failed:', error)
      return this.getFallbackModels(APIProvider.DEEPSEEK)
    }
  }

  private async fetchGroqModels(): Promise<string[]> {
    try {
      // Try to get API key but don't fail if missing
      let apiKey = ''
      try {
        apiKey = await this.getAPIKey(APIProvider.GROQ)
      } catch {
        // If no API key, return fallback models
        return this.getFallbackModels(APIProvider.GROQ)
      }
      
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const models = data.data.map((model: any) => model.id).sort()
      return models.length > 0 ? models : this.getFallbackModels(APIProvider.GROQ)
    } catch (error) {
      console.warn('Groq models fetch failed:', error)
      return this.getFallbackModels(APIProvider.GROQ)
    }
  }

  private async fetchHuggingFaceModels(): Promise<string[]> {
    // Return popular chat models
    return [
      'meta-llama/Llama-2-7b-chat-hf',
      'meta-llama/Llama-2-13b-chat-hf',
      'meta-llama/Llama-2-70b-chat-hf',
      'mistralai/Mistral-7B-Instruct-v0.1',
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'google/flan-t5-xxl',
      'google/flan-ul2',
      'bigscience/bloom',
      'EleutherAI/gpt-neox-20b'
    ]
  }

  private async fetchTogetherModels(): Promise<string[]> {
    try {
      // Try to get API key but don't fail if missing
      let apiKey = ''
      try {
        apiKey = await this.getAPIKey(APIProvider.TOGETHER)
      } catch {
        // If no API key, return fallback models
        return this.getFallbackModels(APIProvider.TOGETHER)
      }
      
      const response = await fetch('https://api.together.xyz/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const models = data.map((model: any) => model.id)
        .filter((id: string) => id && id.includes('chat'))
        .sort()
      return models.length > 0 ? models : this.getFallbackModels(APIProvider.TOGETHER)
    } catch (error) {
      console.warn('Together models fetch failed:', error)
      return this.getFallbackModels(APIProvider.TOGETHER)
    }
  }

  private async fetchOllamaModels(host: string = 'localhost', port: number = 11434): Promise<string[]> {
    try {
      const response = await fetch(`http://${host}:${port}/api/tags`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      return data.models.map((model: any) => model.name).sort()
    } catch (error) {
      console.warn('Ollama models fetch failed:', error)
      return this.getFallbackModels(APIProvider.OLLAMA)
    }
  }

  private async fetchMistralModels(): Promise<string[]> {
    try {
      // Try to get API key but don't fail if missing
      let apiKey = ''
      try {
        apiKey = await this.getAPIKey(APIProvider.MISTRAL)
      } catch {
        // If no API key, return fallback models
        return this.getFallbackModels(APIProvider.MISTRAL)
      }
      
      const response = await fetch('https://api.mistral.ai/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const models = data.data.map((model: any) => model.id).sort()
      return models.length > 0 ? models : this.getFallbackModels(APIProvider.MISTRAL)
    } catch (error) {
      console.warn('Mistral models fetch failed:', error)
      return this.getFallbackModels(APIProvider.MISTRAL)
    }
  }

  private buildUrl(provider: APIProvider, model: string, apiKey: string, agentConfig?: any): string {
    const config = API_PROVIDERS[provider]
    
    if (typeof config.baseUrl === 'function') {
      return config.baseUrl(model, agentConfig)
    }
    
    // Special handling for Gemini - API key sent via x-goog-api-key header, not in URL
    if (provider === APIProvider.GEMINI) {
      return `${config.baseUrl}/${model}:generateContent`
    }
    
    return config.baseUrl
  }

  async sendMessage(
    provider: APIProvider,
    messages: Message[],
    model: string,
    maxTokens: number = 1000,
    temperature: number = 0.7,
    additionalParams?: {
      presencePenalty?: number
      frequencyPenalty?: number
      topP?: number
      topK?: number
      reasoningEffort?: string
      localServerConfig?: any
    }
  ): Promise<APIResponse> {
    try {
      const config = API_PROVIDERS[provider]
      const apiKey = await this.getAPIKey(provider)
      
      const url = this.buildUrl(provider, model, apiKey, additionalParams)
      const headers = config.headers(apiKey)

      const requestBody = config.transformRequest(messages, model, maxTokens, temperature, additionalParams)
      
      // Removed sensitive logging for production

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)
      let response: Response
      try {
        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        })
      } finally {
        clearTimeout(timeoutId)
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error?.message || errorData.message || errorMessage
        } catch {
          // Use default error message if JSON parsing fails
        }
        
        throw new Error(errorMessage)
      }

      let data = await response.json()

      // Async polling for providers like Replicate that return a prediction ID
      if (config.asyncPolling && data.id && data.status !== 'succeeded') {
        const pollUrl = data.urls?.get || `https://api.replicate.com/v1/predictions/${data.id}`
        const maxAttempts = 30
        const pollInterval = 2000

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          await new Promise(resolve => setTimeout(resolve, pollInterval))
          const pollResponse = await fetch(pollUrl, { headers })
          if (!pollResponse.ok) {
            throw new Error(`Prediction polling failed: HTTP ${pollResponse.status}`)
          }
          const pollData = await pollResponse.json()

          if (pollData.status === 'succeeded') {
            data = pollData
            break
          } else if (pollData.status === 'failed' || pollData.status === 'canceled') {
            throw new Error(`Prediction ${pollData.status}: ${pollData.error || 'Unknown error'}`)
          }
          // status is 'starting' or 'processing' — continue polling
        }

        if (data.status !== 'succeeded') {
          throw new Error('Prediction timed out after 60 seconds')
        }
      }

      const content = config.transformResponse(data)

      return {
        success: true,
        data: {
          content,
          model,
          provider,
          usage: data.usage
        }
      }
    } catch (error) {
      console.error(`API call failed for ${provider}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async testConnection(provider: APIProvider): Promise<boolean> {
    try {
      const testMessages: Message[] = [
        {
          id: 'test',
          role: 'user' as any,
          content: 'Hello',
          timestamp: new Date()
        }
      ]

      const config = API_PROVIDERS[provider]
      const result = await this.sendMessage(provider, testMessages, config.defaultModel, 10, 0.1)
      return result.success
    } catch {
      return false
    }
  }

  getAvailableModels(provider: APIProvider): string[] {
    return API_PROVIDERS[provider].models
  }

  getDefaultModel(provider: APIProvider): string {
    return API_PROVIDERS[provider].defaultModel
  }
}