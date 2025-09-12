# AgentCHAT Project Structure

## Root Directory Structure
```
AgentCHAT/
├── src/                    # Main source code
├── electron/               # Electron configuration (if separate)
├── dist/                   # Build output (Vite)
├── release/               # Packaged applications
├── resources/             # Application resources (icons, etc.)
├── node_modules/          # Dependencies
├── scripts/               # Build and utility scripts
├── dev/                   # Development files
├── docs/                  # Documentation
└── archive/               # Archived files
```

## Source Code Structure (`src/`)
```
src/
├── components/            # React UI components
│   ├── AgentConfigPanel.tsx      # Agent settings panel
│   ├── ConversationPanel.tsx     # Main chat interface
│   ├── MessageBubble.tsx         # Individual message display
│   ├── StatusBar.tsx             # Bottom status bar
│   └── APIKeyModal.tsx           # API key configuration modal
├── services/              # Business logic layer
│   ├── AgentManager.ts           # Agent orchestration
│   └── APIClient.ts              # API provider clients
├── types/                 # TypeScript definitions
│   └── index.ts                  # Central type exports
├── App.tsx                # Main application component
├── main.tsx               # React application entry
├── index.html             # HTML template
├── index.css              # Global Tailwind styles
├── main.cjs               # Electron main process
└── preload.cjs            # Electron preload script
```

## Key Configuration Files
- `package.json` - Dependencies, scripts, electron-builder config
- `vite.config.ts` - Vite bundler configuration
- `tsconfig.json` - TypeScript compiler settings
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS processing
- `.gitignore` - Git ignore patterns
- `build-release-run.sh` - Unified build script

## Build Output Structure (`dist/`)
```
dist/
├── index.html             # Built HTML entry point
├── assets/                # Bundled CSS, JS, and static assets
│   ├── index-[hash].js    # Main JavaScript bundle
│   ├── index-[hash].css   # Compiled Tailwind CSS
│   └── [various assets]   # Images, fonts, etc.
└── [other Vite outputs]   # Source maps, manifests
```

## Electron Structure
- `src/main.cjs` - Main process (Node.js environment)
- `src/preload.cjs` - Secure bridge between main and renderer
- Renderer process runs the React app in dist/

## Resources (`resources/`)
```
resources/
├── icons/                 # Application icons
│   ├── icon.icns         # macOS icon
│   ├── icon.ico          # Windows icon
│   └── icon.png          # Linux icon
└── [build resources]     # DMG license, etc.
```

## Development vs Production
- **Development**: Uses Vite dev server on localhost:5173
- **Production**: Serves built files from dist/ directory
- **Packaging**: electron-builder creates platform-specific installers