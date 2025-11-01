# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and other AI assistants when working with code in this repository.

## Project Overview

**AgentCHAT** is a multi-agent AI conversation desktop application built with Electron, React, and TypeScript. It enables conversations between multiple AI agents from different providers (Claude, GPT-4, Gemini, OpenRouter, and 13+ others) in a secure, desktop environment.

**Current Version**: 1.0.0
**Status**: Production-ready
**Architecture**: Electron (Main + Renderer) + React + TypeScript

`★ Insight ─────────────────────────────────────`
The application uses a sophisticated multi-provider AI architecture with secure encrypted storage for API keys. The conversation system allows two AI agents to engage in dialogue with operator intervention capabilities.
`─────────────────────────────────────────────────`

## Essential Development Commands

### Primary Development Workflow
```bash
# Start development with hot reload (most common)
npm run electron:dev     # Vite dev server + Electron with hot reload

# Component testing (web only)
npm run dev              # Vite dev server only
```

### Build & Distribution
```bash
# Quick build for current platform
npm run build            # TypeScript + Vite build
npm run dist:current     # Full production build

# Comprehensive all-platform builds
./scripts/build-universal.sh                    # All platforms, all architectures
./scripts/build-universal.sh --skip-bloat      # Faster build without analysis

# Platform-specific builds
npm run dist:mac         # macOS (Intel + ARM64 + Universal)
npm run dist:win         # Windows (x64 + x86 + ARM64)
npm run dist:linux       # Linux (x64 + ARM64 + ARMv7l)
```

### Code Quality & Testing
```bash
npm run lint             # ESLint with security rules
npm run test             # Jest test runner
npm run test:watch       # Jest in watch mode
npm run test:coverage    # Coverage report
```

### System Maintenance
```bash
./scripts/repository-cleanup.sh    # Clean repository
./scripts/temp-cleanup.sh          # Clean temp files
```

## Architecture Deep Dive

### Electron Security Model
The application follows Electron security best practices with strict process separation:

- **Main Process** (`src/main.cjs`): Node.js environment, handles file system, secure storage, window management
- **Renderer Process** (`src/`): Sandboxed Chromium environment running React frontend
- **Preload Script** (`src/preload.cjs`): Secure IPC bridge with context isolation
- **No Node Integration**: Renderer process cannot access Node.js APIs directly

### Secure API Key Storage
API keys are encrypted with per-installation unique keys:
```javascript
// Main process - generates/loads unique encryption key
function getEncryptionKey() {
  const keyPath = path.join(app.getPath('userData'), '.key')
  // Creates or loads 32-byte hex key with 0o600 permissions
}

// Storage with encryption
store = new Store({
  encryptionKey: getEncryptionKey(),
  name: 'agentchat-config'
})
```

### Multi-Provider AI Architecture
The application supports 15+ AI providers through a unified `APIClient` interface:

**Major Commercial**: Anthropic Claude, OpenAI GPT, Google Gemini
**Open Source via OpenRouter**: Llama, Mixtral, Gemma, Mistral
**Local/Self-hosted**: Ollama, LM Studio, LlamaCPP
**Specialized**: DeepSeek, Groq, HuggingFace, xAI, Together

`★ Insight ─────────────────────────────────────`
The provider abstraction allows easy addition of new AI services. Each provider is configured with base URLs, authentication methods, and available models. The system gracefully handles both free and paid tiers.
`─────────────────────────────────────────────────`

## Core Components & Services

### React Components Architecture
```
src/components/
├── AgentConfigPanel.tsx    # Agent settings, model selection, persona config
├── ConversationPanel.tsx   # Main chat interface with message history
├── MessageBubble.tsx       # Individual message rendering with provider badges
├── StatusBar.tsx           # Connection status, message count, error display
└── APIKeyModal.tsx         # Secure API key input and validation
```

### Business Logic Layer
```
src/services/
├── AgentManager.ts         # Core conversation orchestration and state management
└── APIClient.ts           # Unified HTTP client for all AI providers
```

### Type System (`src/types/index.ts`)
- `APIProvider` enum for all supported providers
- `AgentConfig` interface for agent configuration
- `Conversation` and `Message` types for chat state
- `ElectronAPI` interface for IPC communication

## Development Patterns & Conventions

### React Patterns
- **Functional components only** with hooks (useState, useEffect, useCallback, useRef)
- **Props destructuring** in component parameters
- **Custom hooks** for complex state logic (e.g., conversation state management)
- **TypeScript interfaces** for all component props

### State Management Pattern
The app uses React's built-in state management with refs for conversation control:
```typescript
// Pattern for conversation state that needs to be accessed in async operations
const [conversationState, setConversationStateBase] = useState(ConversationState.IDLE)
const conversationStateRef = useRef(ConversationState.IDLE)

const setConversationState = (newState: ConversationState) => {
  conversationStateRef.current = newState  // Update ref for async access
  setConversationStateBase(newState)       // Update state for re-render
}
```

### File Naming & Organization
- **Components**: PascalCase (`AgentConfigPanel.tsx`)
- **Services**: PascalCase (`AgentManager.ts`)
- **Types**: PascalCase interfaces (`AgentConfig`, `ConversationState`)
- **Variables/Functions**: camelCase (`handleStartConversation`)
- **Constants**: UPPER_SNAKE_CASE (`API_PROVIDERS`)
- **Scripts**: kebab-case (`build-universal.sh`)

### Styling with Tailwind CSS
- **Utility-first approach** - no CSS modules or styled-components
- **Dark theme primary**: `bg-dark-900`, `text-gray-100`
- **Responsive design**: Mobile-first with breakpoint utilities
- **Icons**: Lucide React library with consistent sizing

## Key Implementation Details

### Conversation Loop Implementation
The core conversation logic in `App.tsx:runConversationLoop()`:
- Alternates between Agent 1 and Agent 2 based on turn count
- Uses refs to maintain state across async operations
- Implements pause/resume functionality with state checking
- Handles API errors gracefully with user-friendly messages

### IPC Communication Pattern
All main/renderer communication goes through the secure preload script:
```typescript
// Preload script exposes safe APIs
contextBridge.exposeInMainWorld('electronAPI', {
  storeApiKey: (provider, key) => ipcRenderer.invoke('store-api-key', provider, key),
  getApiKey: (provider) => ipcRenderer.invoke('get-api-key', provider),
  // ... other safe methods
})
```

### Error Handling Strategy
- **API errors**: Graceful degradation with clear error messages
- **Network issues**: Retry logic and user notification
- **Invalid configuration**: Validation before API calls
- **Build failures**: Comprehensive error reporting in build scripts

## Testing & Quality Assurance

### ESLint Configuration
Strict ESLint setup with security-focused rules:
- **TypeScript rules**: Strict type checking, no explicit any
- **Security rules**: Detect object injection, unsafe regex, eval usage
- **Import rules**: Consistent ordering, no cycles
- **SonarJS rules**: Cognitive complexity, code duplication detection

### Build Validation
- **TypeScript compilation**: `tsc` for type checking
- **Vite bundling**: Optimized React build with asset optimization
- **Electron Builder**: Cross-platform packaging with code signing support
- **Size analysis**: Automatic bloat detection and optimization warnings

## Common Development Tasks

### Adding a New AI Provider
1. Add provider to `APIProvider` enum in `src/types/index.ts`
2. Add provider configuration to `API_PROVIDERS` in `src/services/APIClient.ts`
3. Implement HTTP client logic in `APIClient.ts`
4. Update main.cjs environment variable mapping
5. Test with various models and authentication methods

### Modifying the UI
- **Component changes**: Edit files in `src/components/`
- **Global styles**: Modify `src/index.css` or Tailwind config
- **New pages**: Add to React Router in `src/main.tsx`
- **Icons**: Use Lucide React icons for consistency

### Build System Customization
- **Platform settings**: Modify `build` section in `package.json`
- **Script changes**: Update files in `scripts/` directory
- **Asset management**: Add files to `build-resources/`
- **Output customization**: Modify Vite config in `vite.config.ts`

### Security Updates
- **Dependency updates**: Run `npm audit fix` regularly
- **Electron updates**: Check for security advisories
- **API validation**: Review input sanitization in IPC handlers
- **Code signing**: Update certificates before release

## Platform-Specific Considerations

### macOS Development
- **Code signing**: Required for distribution; use Apple Developer certificate
- **Notarization**: Required for App Store distribution
- **Universal builds**: Support both Intel and Apple Silicon
- **Permissions**: Request appropriate system permissions

### Windows Development
- **Code signing**: Recommended to avoid SmartScreen warnings
- **Installer types**: NSIS (simple), MSI (enterprise), portable (zip)
- **Dependencies**: Visual Studio Build Tools for native modules
- **Security**: Windows Defender exclusions may be needed

### Linux Development
- **Package formats**: DEB (Debian/Ubuntu), RPM (Red Hat), AppImage (universal)
- **Dependencies**: System libraries for GTK integration
- **Desktop integration**: .desktop files and icon registration
- **Distribution**: PPA, Snap, or Flatpak for store distribution

## Performance Optimization

### Build Performance
- **Parallel compilation**: Uses all available CPU cores
- **Incremental builds**: Only rebuild changed components
- **Dependency caching**: Cache node_modules for faster builds
- **Asset optimization**: Image and font optimization

### Runtime Performance
- **Memory management**: Monitor for memory leaks in long-running conversations
- **UI responsiveness**: Use React.memo for expensive components
- **API optimization**: Streaming responses and request deduplication
- **Asset loading**: Lazy load non-critical resources

## Debugging & Troubleshooting

### Development Issues
- **Hot reload not working**: Check port 5173 availability and firewall settings
- **TypeScript errors**: Run `npx tsc --noEmit` for detailed error reporting
- **Import resolution**: Verify path aliases in `tsconfig.json`
- **CSS not loading**: Check Tailwind CSS PostCSS configuration

### Electron Issues
- **Blank screen**: Open DevTools to check for JavaScript errors
- **IPC failures**: Verify preload script is loading correctly
- **Window problems**: Check main process window configuration
- **Security errors**: Ensure context isolation is properly configured

### Build Problems
- **Missing dependencies**: Run `npm ci` for clean install
- **Platform tools**: Install Xcode (macOS) or Visual Studio Build Tools (Windows)
- **Disk space**: Ensure adequate space for large builds
- **Permission errors**: Check file system permissions for output directories

This CLAUDE.md should be updated as the project evolves and new patterns emerge. For the most current documentation, see [docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md).