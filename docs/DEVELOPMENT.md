# AgentCHAT Development Guide

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Desktop Framework | Electron | 25.3.1 |
| Frontend | React | 18.2.0 |
| Language | TypeScript | 5.0.2 |
| Build Tool | Vite | 4.4.5 |
| Styling | Tailwind CSS | 3.3.3 |
| Icons | Lucide React | 0.263.1 |
| Storage | Electron Store | 8.1.0 |
| Packaging | Electron Builder | 24.6.3 |

## Environment Setup

### Prerequisites
- Node.js 18+ (check: `node --version`)
- npm 9+ (check: `npm --version`)
- Git
- Code editor (VS Code recommended)

### Initial Setup

```bash
git clone https://github.com/sanchez314c/agent-chat.git
cd agent-chat
npm install
npm run electron:dev
```

## Development Workflow

### Daily Development
```bash
# Start dev server with hot reload
npm run electron:dev

# Or use the platform run script
./run-source-linux.sh   # Linux
./run-source-mac.sh     # macOS
```

### Code Quality
```bash
npm run lint             # ESLint (max 10 warnings)
npm run build            # TypeScript compile + Vite bundle
npm run bloat-check      # Check bundle size
```

### All NPM Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Launch built app with --no-sandbox |
| `npm run dev` | Vite dev server only (port 58743) |
| `npm run build` | TypeScript compile + Vite bundle |
| `npm run electron` | Electron only (requires Vite running) |
| `npm run electron:dev` | Vite + Electron with hot reload |
| `npm run electron:pack` | Package app for current platform |
| `npm run electron:preview` | Build then preview |
| `npm run dist` | Multi-platform distribution builds |
| `npm run dist:mac` | macOS build |
| `npm run dist:win` | Windows build |
| `npm run dist:linux` | Linux build |
| `npm run dist:current` | Build for current platform |
| `npm run lint` | ESLint check |
| `npm run bloat-check` | Bundle size check |

### Unified Build Script

```bash
./scripts/build-release-run.sh                    # Build and run
./scripts/build-release-run.sh --dev              # Development mode
./scripts/build-release-run.sh --platform linux   # Specific platform
./scripts/build-release-run.sh --build-only       # Build without running
./scripts/build-release-run.sh --clean            # Clean build
```

## Build Process

```
Source Code → TypeScript Compile → Vite Bundle → Electron Package
```

### Development Build
```bash
npm run electron:dev     # Hot reload dev mode
```

### Production Build
```bash
npm run build            # Compile + bundle only
npm run dist:current     # Full distribution for current platform
```

### Platform-Specific Distribution

**macOS:**
```bash
npm run dist:mac         # Default targets (DMG, ZIP)
```

**Windows:**
```bash
npm run dist:win         # Default (NSIS installer)
```

**Linux:**
```bash
npm run dist:linux       # Default (AppImage, DEB, RPM)
```

### Build Output

```
dist/
├── renderer/                     # Vite-built React app
│   ├── index.html
│   └── assets/
release/
└── {version}/
    ├── AgentCHAT-{version}.dmg      # macOS
    ├── AgentCHAT Setup {version}.exe # Windows
    └── AgentCHAT-{version}.AppImage  # Linux
```

### Build Configuration

- **TypeScript** (`tsconfig.json`): Target ES2020, strict mode, path mapping `@/*` → `./src/*`
- **Vite** (`vite.config.ts`): React plugin, Electron renderer plugin, output to `dist/renderer/`
- **Electron Builder** (`package.json` → `build`): App ID `com.agentchat.desktop`, maximum compression

## Project Structure

```
src/
├── components/              # React UI components
│   ├── AgentConfigPanel.tsx # Agent settings and configuration
│   ├── ConversationPanel.tsx# Main chat interface
│   ├── MessageBubble.tsx    # Individual message display
│   ├── StatusBar.tsx        # Bottom status bar
│   ├── APIKeyModal.tsx      # Secure API key entry
│   └── ErrorBoundary.tsx    # React error boundary for graceful crash recovery
├── services/                # Business logic
│   ├── AgentManager.ts      # Agent orchestration + message prep
│   └── APIClient.ts         # 14 AI provider API clients
├── types/                   # TypeScript definitions
│   └── index.ts             # All interfaces, enums, types
├── App.tsx                  # Root React component (state orchestration)
├── main.tsx                 # React entry point
├── index.html               # HTML template
├── index.css                # Tailwind + custom Neo-Noir styles
├── main.cjs                 # Electron main process
└── preload.cjs              # Secure IPC bridge

config/
├── tailwind.config.js       # Neo-Noir Glass theme
├── postcss.config.js
└── vite.config.ts           # Alternate build config

scripts/
├── compile-build-dist.sh    # Multi-platform build
├── build-linux.sh           # Linux-specific build
├── build-release-run.sh     # Unified build + run
├── clean-logs.js            # Log cleanup utility
└── bloat-check.sh           # Bundle size analysis
```

## Coding Standards

### TypeScript
- Strict mode enabled
- All components must have typed props interfaces
- Use interfaces over types for objects
- Path mapping: `@/*` resolves to `./src/*`

### React
- Functional components only with hooks
- Props destructuring in component parameters
- Custom hooks for complex state logic
- React.StrictMode enabled in development

### Naming Conventions
- Components: PascalCase (`AgentConfigPanel.tsx`)
- Services: PascalCase (`AgentManager.ts`)
- Types/Interfaces: PascalCase (`AgentConfig`, `ConversationState`)
- Functions/Variables: camelCase (`handleStartConversation`)
- Constants: UPPER_SNAKE_CASE (`API_PROVIDERS`)

### Styling
- Tailwind CSS utility classes only (no CSS modules, no styled-components)
- Neo-Noir Glass theme defined in `config/tailwind.config.js`
- Dark mode primary palette with teal/cyan accents
- Icons from Lucide React

## Key Development Tasks

### Adding a New AI Provider
1. Add provider config to `src/services/APIClient.ts` (endpoint, headers, transformRequest/transformResponse)
2. Add provider type to `src/types/index.ts`
3. Update `AgentConfigPanel.tsx` dropdown and model fetching

### Adding IPC Channels
1. Define handler in `src/main.cjs`
2. Expose in `src/preload.cjs` via `contextBridge`
3. Use in renderer via `window.electronAPI`

### Modifying UI Components
- Components in `src/components/`
- Theme colors in `config/tailwind.config.js`
- Global styles in `src/index.css`

## Environment Variables

```bash
NODE_ENV=development
ELECTRON_ENV=development
VITE_DEV_SERVER_PORT=58743
ELECTRON_DEBUG_PORT=59847
ELECTRON_INSPECT_PORT=61293

# API Keys (optional, fallback if not in encrypted store)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_API_KEY=
OPENROUTER_API_KEY=
```

## Testing Changes

Always test both modes before submitting:

```bash
# Development (hot reload)
npm run electron:dev

# Production preview
npm run build && npm run electron:preview
```

## Common Issues

### DevTools Not Opening
DevTools disabled by default. Enable in `main.cjs`:
```javascript
mainWindow.webContents.openDevTools()
```

### Port Conflicts
Default ports: Dev (58743), Debug (59847), Inspect (61293). Change in `package.json` scripts.

### Linux Sandbox Error
```bash
sudo sysctl -w kernel.unprivileged_userns_clone=1
# Or launch with --no-sandbox flag
```

### Node Native Modules
```bash
npm run postinstall    # Rebuilds native modules for Electron
```

### Clean Build
```bash
rm -rf dist/ release/ node_modules/
npm install
npm run build
```

## Git Workflow

```bash
git checkout -b feature/your-feature
# make changes
git add .
git commit -m "feat: description"
git push origin feature/your-feature
# Open Pull Request
```

---

*See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.*
*See [ARCHITECTURE.md](ARCHITECTURE.md) for system design details.*
