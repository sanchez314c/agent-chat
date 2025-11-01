# Technology Stack

## Core Technologies
- **Language**: TypeScript/JavaScript (ES2020)
- **Framework**: Electron 39.0.0 (Desktop Application)
- **Frontend**: React 18.2.0 with functional components and hooks
- **Runtime**: Node.js >=16.0.0
- **Package Manager**: npm >=7.0.0

## Key Dependencies
- **electron-store**: Encrypted secure storage for API keys
- **lucide-react**: Icon library for UI components
- **clsx**: CSS class utility for conditional styling
- **React**: Core frontend library with hooks

## Development Tools
- **Linter**: ESLint with TypeScript support and React hooks
- **Formatter**: TypeScript compiler with strict mode enabled
- **Testing**: Not currently configured (gap identified)
- **Build Tool**: Vite 7.1.12 with React plugin and hot reload

## Architecture Components
- **Main Process**: Node.js environment (src/main.cjs)
- **Renderer Process**: Chromium environment running React app
- **Preload Script**: Secure IPC bridge (src/preload.cjs)
- **Build Output**: Vite builds to dist/, Electron packages to dist/

## Styling & UI
- **CSS Framework**: Tailwind CSS 3.3.3
- **Processing**: PostCSS with autoprefixer
- **Theme**: Dark mode primary design
- **Icons**: Lucide React icon library

## Build System
- **Development**: Vite dev server + Electron with hot reload (`npm run electron:dev`)
- **Production**: TypeScript compilation + Vite build + Electron Builder
- **Comprehensive Build**: Multi-platform all-variants support via scripts
- **Targets**: macOS (Intel/ARM/Universal), Windows (x64/x86/ARM64), Linux (x64/ARM64/ARMv7l)
- **Formats**: DMG, PKG, NSIS, MSI, ZIP, AppImage, DEB, RPM, SNAP, TAR.GZ, TAR.XZ
- **Build Analysis**: Automated bloat checking and dependency optimization

## Project Type
**Desktop Application**: Multi-Agent AI Conversation Desktop App

Multi-agent conversation system supporting:
- Anthropic Claude (3.5 Sonnet, 3 Opus, 3 Haiku)  
- OpenAI GPT (GPT-4, GPT-4 Turbo, GPT-3.5 Turbo)
- Google Gemini (1.5 Pro, 1.5 Flash)
- OpenRouter (Llama, Mixtral, open-source models)

## Security Features
- Context isolation enabled
- Sandboxed web content  
- Encrypted API key storage with per-installation encryption
- Secure IPC communication through preload script

## Development Workflow
- **Source Development**: `npm run electron:dev` (hot reload)
- **Production Build**: `npm run build` (TypeScript + Vite)
- **Distribution**: `npm run dist` (all platforms)
- **Platform Specific**: `npm run dist:mac|win|linux`
- **Comprehensive Build**: `./scripts/build-compile-dist.sh` (all platforms, all variants)
- **Build Analysis**: `./scripts/bloat-check.sh` (dependency and size optimization)
- **Cleanup**: `./scripts/temp-cleanup.sh` (system maintenance)

## Build Automation Scripts
- **build-compile-dist.sh**: Comprehensive all-platform build system with analysis
- **bloat-check.sh**: Build size analysis and dependency optimization
- **temp-cleanup.sh**: System temporary file cleanup
- **Cross-platform run scripts**: macOS, Linux, Windows source execution