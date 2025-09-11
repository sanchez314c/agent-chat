# AGENTS.md

Instructions for AI agents working on this repository.

## Project Summary

AgentCHAT is an Electron desktop app (React + TypeScript) that lets two AI agents have conversations with each other while a human operator can inject messages in real-time. Supports 14 AI providers including OpenAI, Anthropic, Google Gemini, OpenRouter, and local models (Ollama, Llama.cpp).

## Read These First

1. `src/App.tsx` - Main state orchestration, conversation loop
2. `src/services/AgentManager.ts` - Agent message preparation, context windowing
3. `src/services/APIClient.ts` - All 14 provider configs, request/response transforms
4. `src/types/index.ts` - All TypeScript interfaces and enums
5. `package.json` - Scripts, dependencies, build config

## Architecture

```
Electron Main Process (src/main.cjs)
    ↕ IPC via preload.cjs
React Renderer (src/App.tsx)
    ├── AgentConfigPanel.tsx  (agent + prompt config sidebar)
    ├── ConversationPanel.tsx (chat display + controls)
    ├── MessageBubble.tsx     (individual messages)
    ├── StatusBar.tsx         (status bar)
    └── APIKeyModal.tsx       (secure key entry)
    ↕
Services Layer
    ├── AgentManager.ts       (message prep, context window, export)
    └── APIClient.ts          (14 providers, model fetching, API calls)
```

## Key Patterns

- **Secure Storage**: API keys encrypted via `electron-store` with per-install encryption key
- **IPC Bridge**: All main/renderer communication through `preload.cjs` contextBridge
- **Message Roles**: SYSTEM, USER, ASSISTANT, OPERATOR (operator messages only visible to Agent 1)
- **Context Window**: Last 10 messages sent per API call, with role transformation per agent perspective
- **Provider Abstraction**: Each provider has `transformRequest()` and `transformResponse()` in APIClient

## Commands

```bash
npm run electron:dev     # Dev with hot reload
npm run build            # TypeScript + Vite build
npm run lint             # ESLint check
npm run dist:current     # Package for current platform
```

## Do NOT Modify

- `src/preload.cjs` security model (context isolation, limited API surface)
- Encrypted storage encryption key generation in `src/main.cjs`
- The IPC channel names (would break main/renderer communication)

## Conventions

- Functional React components only, with typed props
- Tailwind CSS utilities only (no CSS modules)
- PascalCase for components/services, camelCase for functions/variables
- All new providers must implement `transformRequest` and `transformResponse` in APIClient.ts

## Testing

```bash
npm run lint             # Linting
npm run build            # Type check + build
npm run electron:dev     # Manual testing with hot reload
npm run electron:preview # Production build preview
```
