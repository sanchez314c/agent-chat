# AgentCHAT Build & Compile Guide

## Build Pipeline

```
Source Code -> TypeScript Compile (tsc) -> Vite Bundle -> Electron Builder Package
```

### Step 1: TypeScript Compilation

```bash
npx tsc
```

- Config: `tsconfig.json` (ES2020 target, strict mode, path mapping `@/*` -> `./src/*`)
- Separate config for Node.js: `tsconfig.node.json`
- Main process files (`main.cjs`, `preload.cjs`) are CommonJS and skip TypeScript compilation

### Step 2: Vite Bundle

```bash
npx vite build
```

- Config: `vite.config.ts` (React plugin + Electron renderer plugin)
- Output: `dist/renderer/` (HTML + JS + CSS assets)
- Dev server port: 58743
- Includes `vite-plugin-electron` and `vite-plugin-electron-renderer`

### Step 3: Electron Builder Package

```bash
npx electron-builder
```

- Config: `package.json` -> `build` section
- App ID: `com.agentchat.desktop`
- Compression: maximum
- Output: `dist/` directory

## Quick Commands

```bash
# Development (hot reload)
npm run electron:dev

# Production build only
npm run build

# Package for current platform
npm run dist:current

# Unified build + run script
./scripts/build-release-run.sh
```

## Platform Builds

### macOS

```bash
npm run dist:mac          # Default targets (DMG, ZIP, PKG)
npm run dist:mac:all      # All architectures (x64, arm64)
npm run dist:mac:store    # Mac App Store target
```

Outputs: `.dmg`, `.zip`, `.pkg` for x64, arm64, and universal

### Windows

```bash
npm run dist:win          # Default (NSIS installer)
npm run dist:win:all      # All architectures (x64, ia32, arm64)
npm run dist:win:msi      # MSI installer
npm run dist:win:portable # Portable EXE
```

Outputs: `.exe` (NSIS), `.msi`, portable `.exe`, `.zip`, `.appx`

### Linux

```bash
npm run dist:linux            # Default targets
npm run dist:linux:all        # All architectures (x64, arm64, armv7l)
npm run dist:linux:appimage   # AppImage only
npm run dist:linux:deb        # Debian package only
npm run dist:linux:rpm        # RPM package only
npm run dist:linux:snap       # Snap package only
npm run dist:linux:tar        # Tarball only
```

Outputs: `.AppImage`, `.deb`, `.rpm`, `.snap`, `.tar.xz`, `.tar.gz`

### All Platforms

```bash
npm run dist:all       # Mac + Win + Linux (default architectures)
npm run dist:maximum   # All platforms, all architectures
```

## Build Scripts

### `scripts/build-release-run.sh`

Unified build and launch script with options:

| Flag | Action |
|------|--------|
| `--dev` | Development mode (Vite + Electron with hot reload) |
| `--build-only` | Build without launching |
| `--clean` | Clean artifacts before building |
| `--platform [mac\|win\|linux\|all]` | Target platform |
| `--quick` | Skip Vite rebuild, use existing dist |

### `scripts/compile-build-dist.sh`

Multi-platform distribution build. Uses `set -e` for fail-fast behavior.

### `scripts/build-linux.sh`

Linux-specific build with DEB and AppImage targets.

### `scripts/bloat-check.sh`

Analyzes bundle size to catch bloat. Run via `npm run bloat-check`.

## Build Output Structure

```
dist/
├── renderer/                     # Vite-built React app
│   ├── index.html
│   └── assets/
│       ├── index-*.js
│       └── index-*.css
└── [platform builds]
    ├── AgentCHAT-{version}.dmg
    ├── AgentCHAT Setup {version}.exe
    └── AgentCHAT-{version}.AppImage
```

## Build Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript: ES2020, strict, JSX react-jsx |
| `tsconfig.node.json` | TypeScript for Vite config files |
| `vite.config.ts` | Root Vite config (React + Electron plugins) |
| `config/vite.config.ts` | Alternate Vite config |
| `config/tailwind.config.js` | Neo-Noir Glass theme definition |
| `config/postcss.config.js` | PostCSS with Tailwind + Autoprefixer |
| `postcss.config.js` | Root PostCSS pointing to config/ |
| `package.json` -> `build` | Electron Builder: targets, icons, compression |

## Electron Builder Configuration

Key settings from `package.json`:

- **files included**: `dist/renderer/**/*`, `src/main.cjs`, `src/preload.cjs`
- **files excluded**: `*.ts`, `*.map`, `*.md`, test dirs, `.git`, `.vscode`, cache
- **publish**: GitHub releases (`sanchez314c/agent-chat`)
- **icons**: `resources/icons/` (PNG for Linux, ICO for Windows, ICNS for macOS)
- **entitlements**: `resources/entitlements.mac.plist` (macOS hardened runtime)

## Troubleshooting Builds

### Clean Build

```bash
rm -rf dist/ node_modules/
npm install
npm run build
```

### Native Module Rebuild

```bash
npm run postinstall    # electron-builder install-app-deps
```

### Linux Sandbox Error

The `--no-sandbox` flag is automatically appended in `main.cjs` for Linux.

---

*See [DEVELOPMENT.md](DEVELOPMENT.md) for daily development workflow. See [DEPLOYMENT.md](DEPLOYMENT.md) for release process.*
