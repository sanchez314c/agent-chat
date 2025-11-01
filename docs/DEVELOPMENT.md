# Development Guide

## Quick Start

### Prerequisites
- Node.js 18.0.0 or higher (latest LTS recommended)
- npm 8.0.0 or higher
- Git for version control
- Code editor with TypeScript support (VS Code recommended)

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/spacewelder314/AgentCHAT.git
cd AgentCHAT

# Install dependencies
npm install

# Start development with hot reload
npm run electron:dev
```

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

# Simple platform builds
npm run dist:current     # Build for current platform only
npm run dist:mac         # Build for macOS (all architectures)
npm run dist:win         # Build for Windows (all architectures)
npm run dist:linux       # Build for Linux (all architectures)
npm run dist:maximum     # Build for all platforms and architectures
```

### Comprehensive Build System (NEW)
```bash
# Complete all-platform build with analysis
./scripts/build-compile-dist.sh                    # All platforms, all variants
./scripts/build-compile-dist.sh --skip-bloat     # Faster without analysis
./scripts/build-compile-dist.sh --skip-temp-clean # Skip system cleanup

# Unified build script (development focused)
./scripts/build-release-run.sh                    # Current platform only
./scripts/build-release-run.sh --dev              # Development mode
./scripts/build-release-run.sh --platform [mac|win|linux|all]
./scripts/build-release-run.sh --build-only       # Build without running
./scripts/build-release-run.sh --clean            # Clean build

# Build analysis and optimization
./scripts/bloat-check.sh                         # Analyze build sizes
./scripts/temp-cleanup.sh                        # Clean system temp files
```

### Package-Specific Builds
```bash
# macOS packages
npm run dist:mac:all      # All macOS variants (Intel, ARM64, Universal)
npm run dist:mac:store    # Mac App Store build

# Windows packages
npm run dist:win:all      # All Windows variants (x64, x86, ARM64)
npm run dist:win:msi      # Microsoft Installer
npm run dist:win:portable # Portable version

# Linux packages
npm run dist:linux:all    # All Linux variants (x64, ARM64, ARMv7l)
npm run dist:linux:appimage # AppImage
npm run dist:linux:deb      # Debian/Ubuntu
npm run dist:linux:rpm      # Red Hat/Fedora
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
- **Build customization**: Modify build scripts in `scripts/` directory

## Advanced AI Integration

### Comprehensive Provider Support
The application supports 15+ AI providers through a unified interface:

#### Major Commercial Providers
- **Anthropic Claude**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo, GPT-4o
- **Google Gemini**: Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 1.0 Pro

#### Open Source via OpenRouter
- **Meta**: Llama 3.1, Llama 3, Llama 2
- **Mistral**: Mixtral 8x7B, Mistral 7B, Mistral Large
- **Google**: Gemma 2, Gemma
- **And 50+ more models** via OpenRouter's unified API

#### Local and Specialized Providers
- **Local Servers**: Ollama, LM Studio, LlamaCPP
- **Specialized APIs**: DeepSeek, Groq, HuggingFace, Meta AI, Pi AI
- **Enterprise**: Together AI, xAI (Grok), Perplexity

### Agent Configuration Pattern
Each agent configured with:
- **Provider selection**: Choose from 15+ AI providers
- **Model variant**: Specific model (GPT-4, Claude-3-Opus, Llama-3.1, etc.)
- **System persona**: Character description and behavior instructions
- **Generation parameters**: Temperature, max tokens, context window
- **Advanced settings**: Top-p, top-k, frequency/penalty, presence penalty
- **Local server config**: For self-hosted models (Ollama, LM Studio)
- **Secure API key storage**: Per-installation encryption

## Development Tools and Debugging

### Development Environment Setup
```bash
# VS Code Extensions (recommended)
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer
```

### Debugging Tools
```bash
# React Developer Tools
- Install in browser: React Developer Tools extension
- Component inspection and state debugging
- Performance profiling

# Electron DevTools
- Toggle with: Cmd/Ctrl + Shift + I
- Main process debugging: --inspect flag
- Renderer process debugging: Standard DevTools

# Debug logging
DEBUG=agentchat:* npm run electron:dev  # Verbose logging
ELECTRON_ENABLE_LOGGING=true npm run electron:dev  # Electron logging
```

### Performance Monitoring
```bash
# Memory usage analysis
- Use Chrome DevTools Memory tab
- Monitor heap snapshots
- Track memory leaks in long-running sessions

# Network performance
- Monitor API response times in Network tab
- Check for bottlenecks in AI provider calls
- Optimize request batching where possible

# Build performance
- Use build-compile-dist.sh with timing analysis
- Monitor build times and identify bottlenecks
- Check dependency sizes with bloat-check.sh
```

## Testing Strategy

### Testing Framework Setup
```
tests/
├── unit/           # Unit tests for components and services
├── integration/    # Integration tests for API clients
└── e2e/           # End-to-end tests for full workflows
```

### Manual Testing Checklist
- [ ] Application launches on all target platforms
- [ ] API key configuration works for all providers
- [ ] Agent conversations start and flow correctly
- [ ] Conversation export functionality
- [ ] Settings persistence across restarts
- [ ] Error handling for network issues
- [ ] Build process creates all expected packages

## Build System Deep Dive

### Comprehensive Build Script Features
The `build-compile-dist.sh` script provides:
- **All platform variants**: 9 total (3 macOS × 3 Windows × 3 Linux)
- **All package types**: 20+ packages (DMG, PKG, EXE, MSI, AppImage, DEB, RPM, etc.)
- **Automated optimization**: Bloat analysis and dependency cleanup
- **System cleanup**: Temporary file management
- **Detailed reporting**: Build statistics and file analysis

### Build Process Flow
1. **System cleanup**: Remove temporary files and old build artifacts
2. **Dependency analysis**: Check for duplicates and optimization opportunities
3. **TypeScript compilation**: Type checking and validation
4. **React build**: Vite bundling with optimization
5. **Electron packaging**: Platform-specific packaging with all variants
6. **Post-build analysis**: Size analysis and optimization recommendations
7. **Final cleanup**: Remove temporary build files

### Icon and Asset Management
- **Multi-platform icons**: Icons stored in `build-resources/icons/`
- **Automatic generation**: Required sizes generated for each platform
- **Consistent branding**: Unified icon set across all platforms
- **Asset optimization**: Images optimized for each target platform

## Troubleshooting

### Common Development Issues
- **Hot reload not working**: Check port conflicts and firewall settings
- **TypeScript errors**: Run `npx tsc --noEmit` to check for type errors
- **Import errors**: Verify path aliases and module resolution
- **CSS not loading**: Check Tailwind CSS configuration and build process

### Build Issues
- **Dependencies**: Run `npm install` and check for outdated packages
- **Platform tools**: Install platform-specific build tools (Xcode, Visual Studio Build Tools)
- **Disk space**: Ensure sufficient storage for large builds
- **Permissions**: Check file system permissions for build directories

### Runtime Issues
- **Blank screen**: Check console for errors and verify React app loads
- **IPC errors**: Ensure preload script properly exposes required APIs
- **API connection failures**: Verify API keys and network connectivity
- **Memory leaks**: Monitor memory usage during long-running sessions