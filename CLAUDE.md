# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Development Workflow
```bash
# Start development with hot reload (most common)
npm run electron:dev     # Vite dev server + Electron with hot reload

# Alternative development commands
npm run dev              # Vite dev server only (for web testing)
npm run electron         # Electron only (requires Vite server running separately)
```

### Build Commands
```bash
# Build application
npm run build            # TypeScript compilation + Vite build
npm run lint             # Run ESLint on TypeScript files

# Distribution builds
npm run dist             # Full production build for current platform
npm run dist:mac         # Build for macOS
npm run dist:win         # Build for Windows  
npm run dist:linux       # Build for Linux
```

### Unified Build Script (Recommended)
```bash
./build-release-run.sh                    # Build and run for current platform
./build-release-run.sh --dev              # Development mode
./build-release-run.sh --platform [mac|win|linux|all]
./build-release-run.sh --build-only       # Build without running
./build-release-run.sh --clean            # Clean build
```

## Architecture Overview

### Electron Application Structure
This is an **Electron desktop application** with clear separation between processes:

- **Main Process** (`src/main.cjs`): Node.js environment handling file system, storage, window management
- **Renderer Process** (`src/` React app): Chromium environment running the React frontend  
- **Preload Script** (`src/preload.cjs`): Secure bridge between main and renderer processes
- **Build Output**: Vite builds React app to `dist/`, Electron packages for distribution to `release/`

### Key Architectural Patterns

**Secure Storage**: API keys encrypted using `electron-store` with per-installation encryption keys
```javascript
// Main process handles all secure storage operations
store = new Store({
  encryptionKey: getEncryptionKey(),
  name: 'agentchat-config'
})
```

**IPC Communication**: All main/renderer communication through secure IPC channels defined in preload script

**Agent Architecture**: Multi-agent conversation system with pluggable AI providers (Claude, GPT-4, Gemini, OpenRouter)

## Project Structure

### Core Source Files
```
src/
├── components/              # React UI components
│   ├── AgentConfigPanel.tsx # Agent settings and configuration
│   ├── ConversationPanel.tsx # Main chat interface  
│   ├── MessageBubble.tsx    # Individual message display
│   ├── StatusBar.tsx        # Bottom status bar
│   └── APIKeyModal.tsx      # Secure API key configuration
├── services/                # Business logic layer
│   ├── AgentManager.ts      # Core agent orchestration
│   └── APIClient.ts         # AI provider API clients
├── types/                   # TypeScript definitions
├── App.tsx                  # Main React application
├── main.tsx                 # React entry point
├── main.cjs                 # Electron main process
└── preload.cjs              # Secure IPC bridge
```

### Build and Distribution
```
dist/                        # Vite build output (React app)
release/{version}/           # Electron packaged applications
├── AgentCHAT-{version}.dmg           # macOS installer
├── AgentCHAT Setup {version}.exe     # Windows installer  
└── AgentCHAT-{version}.AppImage      # Linux AppImage
```

## Code Conventions

### TypeScript Configuration
- **Strict mode enabled** with ES2020 target
- **Path mapping**: `@/*` resolves to `./src/*`
- **JSX**: `react-jsx` transform
- All components must have proper TypeScript interfaces for props

### React Patterns
- **Functional components only** with hooks (useState, useEffect, useCallback, useRef)
- **Props destructuring** in component parameters
- **Custom hooks** for complex state logic
- React.StrictMode enabled in development

### File Naming Conventions
- **Components**: PascalCase (`AgentConfigPanel.tsx`)
- **Services**: PascalCase (`AgentManager.ts`)  
- **Types**: PascalCase interfaces (`AgentConfig`, `ConversationState`)
- **Variables/Functions**: camelCase (`handleStartConversation`)
- **Constants**: UPPER_SNAKE_CASE (`API_PROVIDERS`)

### Styling Approach
- **Framework**: Tailwind CSS 3 with utility-first approach
- **Theme**: Dark mode primary (`bg-dark-900`, `text-gray-100`) 
- **Icons**: Lucide React icon library
- **No CSS modules or styled-components** - pure Tailwind utilities

## AI Integration Architecture

### Provider Support
The application supports multiple AI providers through a unified interface:
- **Anthropic Claude**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo  
- **Google Gemini**: Gemini 1.5 Pro, Gemini 1.5 Flash
- **OpenRouter**: Access to open-source models (Llama, Mixtral, etc.)

### Agent Configuration Pattern
Each agent configured with:
- Provider selection and model variant
- System persona and behavior instructions  
- Temperature, max tokens, and context window settings
- Secure API key storage with per-installation encryption

## Development Notes

### Security Considerations
- **Context isolation enabled** - renderer cannot access Node.js APIs
- **Sandboxed web content** - strict security boundaries
- **Encrypted storage** - API keys never stored in plain text
- **Secure IPC** - all main/renderer communication through preload script

### Build Process
1. **TypeScript compilation** (`tsc`)
2. **Vite build** - bundles React app with assets
3. **Electron Builder** - creates platform-specific installers
4. **Hot reload** in development via concurrent Vite + Electron processes

### Testing Development Changes
Always test both:
1. **Development mode**: `npm run electron:dev` (hot reload)
2. **Production build**: `npm run build && npm run electron:preview` (verify packaging)

### Common Development Tasks
- **Add new AI provider**: Extend `APIClient.ts` service and update provider types
- **UI modifications**: Edit React components in `src/components/`
- **Storage changes**: Modify main process handlers in `src/main.cjs`
- **IPC additions**: Update `src/preload.cjs` for new main/renderer communication