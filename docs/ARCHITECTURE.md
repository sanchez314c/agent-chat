# AgentCHAT Architecture

## Overview

AgentCHAT is an Electron-based desktop application that enables multi-agent AI conversations. The architecture follows a clear separation between Electron's main process and renderer process.

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     AgentCHAT Desktop App                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    IPC Bridge    ┌─────────────────┐   │
│  │  Main Process   │◄───────────────►│ Renderer Process │   │
│  │   (Node.js)     │   (preload.cjs)  │    (Chromium)    │   │
│  └────────┬────────┘                  └────────┬────────┘   │
│           │                                    │            │
│  ┌────────▼────────┐                  ┌────────▼────────┐   │
│  │ Electron Store  │                  │   React App     │   │
│  │ (Encrypted)     │                  │   + Vite        │   │
│  └─────────────────┘                  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │      AI Provider APIs         │
              │ (Claude, GPT-4, Gemini, etc.) │
              └───────────────────────────────┘
```

## Process Architecture

### Main Process (`src/main.cjs`)
- **Role**: Node.js environment for system operations
- **Responsibilities**:
  - Window management (BrowserWindow)
  - Secure storage (electron-store with encryption)
  - File system operations
  - IPC message handling
  - Application lifecycle

### Preload Script (`src/preload.cjs`)
- **Role**: Secure bridge between main and renderer
- **Responsibilities**:
  - Expose safe APIs to renderer
  - Context isolation enforcement
  - IPC channel definitions

### Renderer Process (`src/`)
- **Role**: React application in Chromium
- **Responsibilities**:
  - User interface (React + Tailwind CSS)
  - Agent configuration UI
  - Conversation display
  - State management

## Component Architecture

```
src/
├── components/
│   ├── AgentConfigPanel.tsx    # Agent settings sidebar
│   ├── ConversationPanel.tsx   # Chat interface + controls
│   ├── MessageBubble.tsx       # Individual message rendering
│   ├── StatusBar.tsx           # Status display
│   ├── APIKeyModal.tsx         # API key management
│   └── ErrorBoundary.tsx       # React error boundary
├── services/
│   ├── AgentManager.ts         # Agent orchestration + message prep + export
│   └── APIClient.ts            # 14 AI provider clients
├── types/
│   └── index.ts                # TypeScript definitions
├── App.tsx                     # Root component + conversation loop state
├── main.tsx                    # React entry
├── main.cjs                    # Electron main
└── preload.cjs                 # IPC bridge
```

## Data Flow

1. **User Input** → React Component
2. **Component** → Service Layer (AgentManager)
3. **Service** → IPC (if storage needed) → Main Process
4. **Service** → API Client → External AI Provider
5. **Response** → State Update → UI Render

## Security Model

- **Context Isolation**: Enabled - renderer cannot access Node.js
- **Sandbox**: Web content sandboxed
- **Encrypted Storage**: API keys encrypted at rest
- **Secure IPC**: All cross-process communication through preload

## AI Provider Integration

Pluggable provider architecture in `src/services/APIClient.ts`. Each provider implements `transformRequest()`, `transformResponse()`, and `headers()`. 14 providers supported:

| Provider | Auth | Notes |
|----------|------|-------|
| OpenRouter | API Key | Hundreds of models including free tiers |
| OpenAI | API Key | GPT-4, GPT-4o, o1 series |
| Anthropic | API Key | Claude 3.5 Sonnet, Opus 4, Haiku |
| Google Gemini | API Key | Gemini 2.5 Pro, 2.0 Flash, 1.5 series, Gemma |
| DeepSeek | API Key | deepseek-chat, deepseek-coder |
| Groq | API Key | Fast inference for Llama3, Mixtral |
| HuggingFace | API Key | Inference API for open models |
| Together AI | API Key | Llama 3, Mixtral, Nous Hermes |
| Mistral AI | API Key | mistral-small, mistral-large |
| xAI (Grok) | API Key | grok-1, grok-2 |
| Pi.ai | API Key | pi model |
| Meta (Replicate) | API Key | llama-2-70b-chat via Replicate API |
| Ollama | None | Local server, default port 11434 |
| Llama.cpp | None | Local server, default port 8080 |

---

*See [DEVELOPMENT.md](DEVELOPMENT.md) for tech stack and build details.*
