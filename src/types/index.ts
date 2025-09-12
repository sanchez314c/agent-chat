// API Provider types
export enum APIProvider {
  OPENROUTER = 'openrouter',
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GEMINI = 'gemini',
  DEEPSEEK = 'deepseek',
  GROQ = 'groq',
  HUGGINGFACE = 'huggingface',
  META = 'meta',
  MISTRAL = 'mistral',
  PI = 'pi',
  TOGETHER = 'together',
  XAI = 'xai',
  OLLAMA = 'ollama',
  LLAMACPP = 'llamacpp'
}

export interface APIProviderConfig {
  name: string
  baseUrl: string
  defaultModel: string
  models: string[]
  requiresAuth: boolean
}

// Local Server Configuration
export interface LocalServerConfig {
  host: string
  port: number
}

// Agent Configuration
export interface AgentConfig {
  id: string
  name: string
  provider: APIProvider
  model: string
  persona: string
  temperature: number
  maxTokens: number
  // New parameters
  presencePenalty?: number
  frequencyPenalty?: number
  topP?: number
  topK?: number
  reasoningEffort?: string // For models that support it
  // Local server configuration
  localServerConfig?: LocalServerConfig
}

// Conversation types
export enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  OPERATOR = 'operator' // New role for operator messages
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  agentId?: string
  provider?: APIProvider
  model?: string
  isOperatorMessage?: boolean // Flag for operator injected messages
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  agents: [AgentConfig, AgentConfig]
  systemPrompt: string
  initialPrompt: string
}

// App State
export enum ConversationState {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  ERROR = 'error'
}

export interface AppState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  conversationState: ConversationState
  errorMessage?: string
}

// Settings
export interface AppSettings {
  theme: 'dark' | 'light'
  maxTokens: number
  temperature: number
  contextLength: number
  autoSave: boolean
  showTimestamps: boolean
}

// API Response types
export interface APIResponse {
  success: boolean
  data?: any
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Electron API types
export interface ElectronAPI {
  storeApiKey: (provider: string, key: string) => Promise<{ success: boolean; error?: string }>
  getApiKey: (provider: string) => Promise<{ success: boolean; key?: string; error?: string }>
  deleteApiKey: (provider: string) => Promise<{ success: boolean; error?: string }>
  saveConversation: (content: string) => Promise<{ success: boolean; filePath?: string; cancelled?: boolean; error?: string }>
  onMenuNewConversation: (callback: () => void) => void
  onMenuSaveConversation: (callback: () => void) => void
  platform: string
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}