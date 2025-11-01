# API Documentation

This document provides detailed information about the APIs and interfaces used in AgentCHAT.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [AI Provider APIs](#ai-provider-apis)
- [Internal APIs](#internal-apis)
- [IPC Communication](#ipc-communication)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)

## Architecture Overview

AgentCHAT uses a multi-layered API architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Renderer      │    │     Main         │    │   External APIs │
│   (React App)   │◄──►│   (Electron)     │◄──►│  (AI Providers) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │
        └───────────────────────┘
           (Secure IPC Bridge)
```

## AI Provider APIs

### Supported Providers

AgentCHAT supports 15+ AI providers through unified interfaces:

#### Commercial Providers

**Anthropic Claude**
- API Endpoint: `https://api.anthropic.com/v1/messages`
- Models: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- Authentication: x-api-key header
- Rate Limits: 5 requests per second

**OpenAI GPT**
- API Endpoint: `https://api.openai.com/v1/chat/completions`
- Models: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo, GPT-4o
- Authentication: Bearer token
- Rate Limits: 3,500 requests per hour (GPT-4)

**Google Gemini**
- API Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- Models: Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 1.0 Pro
- Authentication: API key in query parameters
- Rate Limits: 60 requests per minute

#### Open Source via OpenRouter

**Meta Llama**
- Models: Llama 3.1, Llama 3, Llama 2
- Access: Via OpenRouter API
- Rate Limits: Shared with OpenRouter

**Mistral Models**
- Models: Mixtral 8x7B, Mistral 7B, Mistral Large
- Access: Via OpenRouter API
- Rate Limits: Shared with OpenRouter

#### Local Providers

**Ollama**
- Endpoint: Configurable (default: `http://localhost:11434`)
- Models: Locally hosted models
- Authentication: None

**LM Studio**
- Endpoint: Configurable (default: `http://localhost:1234`)
- Models: Locally hosted models
- Authentication: None

#### Specialized Providers

**DeepSeek**
- API Endpoint: `https://api.deepseek.com/v1/chat/completions`
- Models: deepseek-chat, deepseek-coder

**Groq**
- API Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Models: Llama 3.1 70B, Mixtral 8x7B

**xAI (Grok)**
- API Endpoint: `https://api.x.ai/v1/chat/completions`
- Models: grok-beta

## Internal APIs

### APIClient Class

The main interface for AI provider communication:

```typescript
export class APIClient {
  // Send message to AI provider
  async sendMessage(
    provider: APIProvider,
    messages: Message[],
    model: string,
    maxTokens: number,
    temperature: number,
    additionalParams?: any
  ): Promise<APIResponse>

  // Get available models for provider
  getAvailableModels(provider: APIProvider): string[]
}
```

### AgentManager Class

Core agent orchestration and management:

```typescript
export class AgentManager {
  // Get response from AI agent
  async getResponse(
    agent: AgentConfig,
    conversationMessages: Message[]
  ): Promise<string>

  // Export conversation as Markdown
  exportConversationAsMarkdown(
    messages: Message[],
    agent1Name: string,
    agent2Name: string,
    title: string
  ): string
}
```

## IPC Communication

### Main Process APIs

Secure APIs exposed to the renderer process through the preload script:

```typescript
// API Key management
ipcMain.handle('store-api-key', (_, provider: string, key: string) => Promise<{success: boolean, error?: string}>)
ipcMain.handle('get-api-key', (_, provider: string) => Promise<{success: boolean, key?: string, error?: string}>)
ipcMain.handle('delete-api-key', (_, provider: string) => Promise<{success: boolean, error?: string}>)

// File operations
ipcMain.handle('save-conversation', (_, content: string) => Promise<{
  success: boolean
  filePath?: string
  cancelled?: boolean
  error?: string
}>)
```

### Renderer Process APIs

Available through the preload script:

```typescript
interface ElectronAPI {
  // API Key management
  storeApiKey: (provider: string, key: string) => Promise<{success: boolean, error?: string}>
  getApiKey: (provider: string) => Promise<{success: boolean, key?: string, error?: string}>
  deleteApiKey: (provider: string) => Promise<{success: boolean, error?: string}>

  // File operations
  saveConversation: (content: string) => Promise<{
    success: boolean
    filePath?: string
    cancelled?: boolean
    error?: string
  }>

  // Menu event listeners
  onMenuNewConversation: (callback: () => void) => void
  onMenuSaveConversation: (callback: () => void) => void

  // Utility
  platform: string
}
```

## Type Definitions

### Core Types

```typescript
// Agent configuration
interface AgentConfig {
  id: string
  name: string
  provider: APIProvider
  model: string
  persona: string
  temperature: number
  maxTokens: number
  presencePenalty?: number
  frequencyPenalty?: number
  topP?: number
  topK?: number
  reasoningEffort?: string
  localServerConfig?: LocalServerConfig
}

// Message structure
interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  agentId?: string
  provider?: APIProvider
  model?: string
  isOperatorMessage?: boolean
}

// Message roles
enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  OPERATOR = 'operator'
}

// Conversation state
enum ConversationState {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  ERROR = 'error'
}

// API response structure
interface APIResponse {
  success: boolean
  data?: {
    content: string
    usage?: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
  }
  error?: string
}
```

### Provider Types

```typescript
// Supported AI providers
enum APIProvider {
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

// Provider configuration
interface APIProviderConfig {
  name: string
  baseUrl: string | ((model?: string, config?: any) => string)
  defaultModel: string
  models: string[]
  headers: (apiKey: string) => Record<string, string>
  transformRequest: (messages: Message[], model: string, maxTokens: number, temperature: number, additionalParams?: any) => any
  transformResponse: (response: any) => string
  supportsStreaming?: boolean
  requiresAuth: boolean
}
```

## Error Handling

### Error Types

```typescript
// API error structure
interface APIError {
  success: false
  error: string
}

// Common error scenarios
enum ErrorType {
  API_KEY_MISSING = 'API key is required',
  API_KEY_INVALID = 'Invalid API key',
  NETWORK_ERROR = 'Network connection failed',
  INVALID_RESPONSE = 'Invalid response from API',
  RATE_LIMIT_EXCEEDED = 'Rate limit exceeded',
  TOKEN_LIMIT_EXCEEDED = 'Token limit exceeded',
  INVALID_MODEL = 'Invalid model specified',
  CONFIGURATION_ERROR = 'Configuration error'
}
```

### Error Recovery Strategies

1. **Network Errors**: Display user-friendly error message with retry option
2. **Rate Limits**: Inform user and suggest waiting period
3. **Invalid Configuration**: Prompt user to correct API keys or settings
4. **Token Limits**: Suggest reducing conversation history or max tokens

## Security Considerations

### API Key Management

- **Encrypted Storage**: API keys stored using electron-store with per-installation encryption
- **No Logging**: API keys never logged or transmitted except to their respective providers
- **Memory Cleanup**: Keys cleared from memory after use
- **Environment Variable Support**: Alternative storage method for enhanced security

### Request Validation

- **Input Sanitization**: All user inputs validated before API calls
- **Rate Limiting**: Built-in protection against API abuse
- **HTTPS Only**: All API communications use HTTPS

### Secure Communication

- **Context Isolation**: Renderer process isolated from Node.js APIs
- **IPC Bridge**: Secure communication through preload script
- **No eval()**: Prevention of code injection attacks

## Rate Limiting

### Provider-Specific Limits

- **Claude**: 5 requests per second (default)
- **OpenAI**: 3,500 requests per hour (GPT-4)
- **Gemini**: 60 requests per minute
- **OpenRouter**: 100 requests per minute
- **Groq**: 30 requests per minute
- **DeepSeek**: Varies by plan
- **xAI**: Varies by plan

### Request Coordination

The application includes built-in request coordination to prevent rate limit exceeded errors:
- Automatic request queuing
- Exponential backoff retry logic
- Provider-aware rate limit tracking

## Streaming Support

Currently, AgentCHAT does not implement streaming responses. All API calls use standard HTTP requests with complete response payloads.

## Testing the API

### Unit Tests

```typescript
describe('APIClient', () => {
  test('should send message to Claude', async () => {
    const client = new APIClient()
    const response = await client.sendMessage(
      APIProvider.ANTHROPIC,
      [{ role: MessageRole.USER, content: 'Hello', id: '1', timestamp: new Date() }],
      'claude-3-5-sonnet-20241022',
      1000,
      0.7
    )
    expect(response.success).toBe(true)
    expect(response.data?.content).toBeDefined()
  })
})
```

### Integration Tests

```typescript
describe('AI Provider Integration', () => {
  test('should connect to real API', async () => {
    const agentManager = new AgentManager()
    const response = await agentManager.getResponse(testAgent, testMessages)
    expect(response).toBeTruthy()
    expect(typeof response).toBe('string')
  })
})
```

## API Versioning

### Current Version: v1.0.0

### Versioning Strategy

- **Semantic Versioning**: Following semver for breaking changes
- **Backward Compatibility**: Maintained for minor versions
- **Deprecation Warnings**: Provided for obsolete features
- **Migration Guides**: Available for major updates

## Future Enhancements

### Planned Features

- [ ] **Streaming Support**: Real-time response streaming
- [ ] **Batch Processing**: Send multiple requests concurrently
- [ ] **Advanced Caching**: Intelligent response caching
- [ ] **Custom Provider SDK**: Plugin system for new providers
- [ ] **Webhook Support**: Automation and integration capabilities

### API Extensions

- [ ] **Vision Models**: Image input support
- [ ] **Audio Models**: Voice input/output
- [ ] **Function Calling**: Tool use capabilities
- [ ] **Fine-tuning**: Custom model training integration

---

**Note**: This API documentation reflects the current implementation as of v1.0.0. For the most up-to-date information, please refer to the source code in the `src/` directory.