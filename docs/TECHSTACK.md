# AgentCHAT Tech Stack

## Core Technologies

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Desktop Framework | Electron | 25.3.1 | Cross-platform desktop shell (Chromium + Node.js) |
| Frontend Framework | React | 18.2.0 | Component-based UI with hooks |
| Language | TypeScript | 5.0.2 | Type safety across renderer and config files |
| Build Tool | Vite | 4.4.5 | Fast dev server (port 58743) and production bundler |
| Styling | Tailwind CSS | 3.3.3 | Utility-first CSS with Neo-Noir Glass theme |
| Icons | Lucide React | 0.263.1 | SVG icon components |
| Secure Storage | electron-store | 8.1.0 | Encrypted JSON storage for API keys |
| Packaging | electron-builder | 24.6.3 | Multi-platform installers (DMG, EXE, AppImage, DEB, RPM, Snap) |

## Development Dependencies

| Tool | Version | Purpose |
|------|---------|---------|
| @vitejs/plugin-react | 4.0.3 | React Fast Refresh for Vite |
| vite-plugin-electron | 0.13.0-beta.3 | Electron main process integration with Vite |
| vite-plugin-electron-renderer | 0.14.5 | Electron renderer process integration |
| concurrently | 8.2.0 | Run Vite + Electron dev servers in parallel |
| cross-env | 7.0.3 | Cross-platform environment variable setting |
| wait-on | 7.0.1 | Wait for Vite dev server before launching Electron |
| ESLint | 8.45.0 | Code quality with TypeScript and React rules |
| PostCSS | 8.4.27 | CSS processing pipeline |
| Autoprefixer | 10.4.14 | Browser vendor prefix automation |

## Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.2.0 | UI rendering |
| react-dom | 18.2.0 | DOM rendering |
| clsx | 2.0.0 | Conditional CSS class composition |
| lucide-react | 0.263.1 | Icon library |
| electron-store | 8.1.0 | Encrypted persistent storage |

## Architecture Pattern

```
Electron Main Process (Node.js)
    ├── Window management (BrowserWindow, frameless + transparent)
    ├── Encrypted storage (electron-store with per-install key)
    ├── File system operations (save dialog)
    └── IPC handlers (store-api-key, get-api-key, delete-api-key, save-conversation)

Preload Script (contextBridge)
    └── Exposes safe API surface to renderer

React Renderer (Chromium)
    ├── App.tsx (conversation loop state machine)
    ├── Components (6 functional components with hooks)
    ├── Services
    │   ├── AgentManager (message preparation, context windowing)
    │   └── APIClient (14 provider configs, model fetching)
    └── Types (enums + interfaces)
```

## AI Provider Integration

14 providers connected through a unified `APIProviderConfig` interface. Each provider defines:
- `baseUrl` (static string or dynamic function)
- `headers(apiKey)` for authentication
- `transformRequest()` to format messages per provider API
- `transformResponse()` to extract response content

Cloud providers (12): OpenRouter, OpenAI, Anthropic, Gemini, DeepSeek, Groq, HuggingFace, Meta/Replicate, Mistral, Pi.ai, Together, xAI

Local providers (2): Ollama (port 11434), Llama.cpp (port 8080) -- with SSRF prevention (localhost-only validation)

## Build Targets

| Platform | Formats | Architectures |
|----------|---------|---------------|
| macOS | DMG, ZIP, PKG, MAS | x64, arm64, universal |
| Windows | NSIS, MSI, ZIP, Portable, APPX | x64, ia32, arm64 |
| Linux | AppImage, DEB, RPM, Snap, tar.xz, tar.gz | x64, arm64, armv7l |

## Security Stack

- **Context Isolation**: Renderer cannot access Node.js APIs
- **Sandbox**: Web content runs in sandboxed environment
- **Encrypted Storage**: API keys encrypted at rest with per-install key (`crypto.randomBytes(32)`)
- **SSRF Prevention**: Local server hosts validated against localhost allowlist
- **Input Sanitization**: Internal params stripped before sending to third-party APIs
- **Protocol Validation**: `shell.openExternal()` restricted to http/https
- **Provider Allowlist**: IPC handlers validate provider names against fixed list

---

*See [DEVELOPMENT.md](DEVELOPMENT.md) for setup and build commands. See [ARCHITECTURE.md](ARCHITECTURE.md) for system design.*
