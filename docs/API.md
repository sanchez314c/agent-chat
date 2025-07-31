# AgentCHAT API Reference

## IPC API (Main Process <-> Renderer)

All communication between the Electron main process and the React renderer goes through `src/preload.cjs` via `contextBridge.exposeInMainWorld('electronAPI', ...)`.

### `window.electronAPI.storeApiKey(provider, key)`

Stores an encrypted API key for a provider.

- **Parameters**: `provider` (string from VALID_PROVIDERS list), `key` (string)
- **Returns**: `{ success: boolean, error?: string }`
- **IPC Channel**: `store-api-key`
- **Validation**: Provider checked against allowlist of 21 valid provider names

### `window.electronAPI.getApiKey(provider)`

Retrieves a stored API key. Checks environment variables first, then falls back to encrypted store.

- **Parameters**: `provider` (string)
- **Returns**: `{ success: boolean, key?: string, error?: string }`
- **IPC Channel**: `get-api-key`
- **Env Fallback**: Maps provider name to env var (e.g., `anthropic` -> `ANTHROPIC_API_KEY`)

### `window.electronAPI.deleteApiKey(provider)`

Removes a stored API key.

- **Parameters**: `provider` (string)
- **Returns**: `{ success: boolean, error?: string }`
- **IPC Channel**: `delete-api-key`

### `window.electronAPI.saveConversation(content)`

Opens a native save dialog and writes conversation content to a file.

- **Parameters**: `content` (string, Markdown formatted)
- **Returns**: `{ success: boolean, filePath?: string, cancelled?: boolean, error?: string }`
- **IPC Channel**: `save-conversation`
- **Default filename**: `AgentCHAT-YYYY-MM-DD.md`

## Service Layer API

### AgentManager (`src/services/AgentManager.ts`)

The orchestration layer between the React UI and the API client.

#### `getResponse(agent: AgentConfig, conversationMessages: Message[]): Promise<string>`

Gets a response from an AI provider for a given agent, preparing messages with role transformation and context windowing (last 10 messages).

#### `getAvailableModels(provider: APIProvider): Promise<string[]>`

Fetches available models for a provider. Uses cached results when available, falls back to hardcoded model lists.

#### `getDefaultModel(provider: APIProvider): string`

Returns the default model string for a provider.

#### `saveAPIKey(provider, key): Promise<boolean>`

Saves an API key through the Electron IPC bridge.

#### `getAPIKey(provider): Promise<string | null>`

Retrieves an API key through the Electron IPC bridge.

#### `exportConversationAsMarkdown(messages, agent1Name, agent2Name, title): string`

Converts a message array into a formatted Markdown document with agent names and timestamps.

### APIClient (`src/services/APIClient.ts`)

Handles all HTTP communication with AI providers.

#### `sendMessage(provider, messages, model, maxTokens, temperature, additionalParams): Promise<APIResponse>`

Sends a chat completion request to the specified provider.

- **Timeout**: 60 seconds (AbortController)
- **additionalParams**: `presence_penalty`, `frequency_penalty`, `top_p`, `top_k`, `reasoning_effort`, `localServerConfig`
- Internal fields (`localServerConfig`, `provider`, `model`, `apiKey`) are stripped before sending to third-party APIs

#### `fetchModelsForProvider(provider): Promise<string[]>`

Fetches model lists from provider APIs. Providers with dynamic endpoints (OpenRouter, OpenAI, Gemini, DeepSeek, Groq, Together, Mistral, Ollama) are queried live. Others return static lists.

#### `testConnection(provider): Promise<boolean>`

Sends a minimal test message to verify provider connectivity and API key validity.

## Provider Endpoints

| Provider | Base URL | Auth Header |
|----------|----------|-------------|
| OpenRouter | `https://openrouter.ai/api/v1/chat/completions` | `Authorization: Bearer` |
| OpenAI | `https://api.openai.com/v1/chat/completions` | `Authorization: Bearer` |
| Anthropic | `https://api.anthropic.com/v1/messages` | `x-api-key` |
| Gemini | `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` | `x-goog-api-key` |
| DeepSeek | `https://api.deepseek.com/v1/chat/completions` | `Authorization: Bearer` |
| Groq | `https://api.groq.com/openai/v1/chat/completions` | `Authorization: Bearer` |
| HuggingFace | `https://api-inference.huggingface.co/models/{model}` | `Authorization: Bearer` |
| Meta/Replicate | `https://api.replicate.com/v1/predictions` | `Authorization: Token` |
| Mistral | `https://api.mistral.ai/v1/chat/completions` | `Authorization: Bearer` |
| Pi.ai | `https://api.pi.ai/v1/chat` | `X-API-Key` |
| Together | `https://api.together.xyz/v1/chat/completions` | `Authorization: Bearer` |
| xAI | `https://api.x.ai/v1/chat/completions` | `Authorization: Bearer` |
| Ollama | `http://localhost:11434/api/chat` | None |
| Llama.cpp | `http://localhost:8080/v1/chat/completions` | None |

## TypeScript Types

All types live in `src/types/index.ts`.

### Enums

- **APIProvider**: `openrouter`, `openai`, `anthropic`, `gemini`, `deepseek`, `groq`, `huggingface`, `meta`, `mistral`, `pi`, `together`, `xai`, `ollama`, `llamacpp`
- **MessageRole**: `system`, `user`, `assistant`, `operator`
- **ConversationState**: `idle`, `running`, `paused`, `error`

### Key Interfaces

- **AgentConfig**: `id`, `name`, `provider`, `model`, `persona`, `temperature`, `maxTokens`, `presencePenalty?`, `frequencyPenalty?`, `topP?`, `topK?`, `reasoningEffort?`, `localServerConfig?`
- **Message**: `id`, `role`, `content`, `timestamp`, `agentId?`, `provider?`, `model?`, `isOperatorMessage?`
- **Conversation**: `id`, `title`, `messages`, `createdAt`, `updatedAt`, `agents` (tuple of 2), `systemPrompt`, `initialPrompt`
- **APIResponse**: `success`, `data?`, `error?`, `usage?`

---

*See [ARCHITECTURE.md](ARCHITECTURE.md) for system design. See [DEVELOPMENT.md](DEVELOPMENT.md) for adding new providers.*
