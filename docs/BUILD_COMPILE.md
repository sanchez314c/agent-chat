# Build & Compile Instructions

Comprehensive guide for building and compiling the AgentCHAT application across all supported platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Build](#development-build)
- [Production Build](#production-build)
- [Build Configuration](#build-configuration)
- [Build Scripts](#build-scripts)
- [Platform-Specific Builds](#platform-specific-builds)
- [Build Outputs](#build-outputs)
- [Build Optimization](#build-optimization)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: Version 18.0.0 or higher (latest LTS recommended)
- **npm**: Version 8.0.0 or higher
- **Git**: For version control
- **Disk Space**: 2GB free space for all builds
- **RAM**: 8GB recommended for multi-platform builds

### Platform-Specific Requirements

#### macOS
- **Xcode**: Latest version from App Store
- **Command Line Tools**: `xcode-select --install`
- **Python 3**: Required for some Node.js modules

#### Windows
- **Visual Studio Build Tools**: 2022 or later
- **Windows SDK**: Latest version
- **.NET Framework**: 4.8+ (usually included with Windows)

#### Linux
- **Build Essentials**: `build-essential` package
- **Python 3**: Required for node-gyp
- **libnss3-dev**: For Electron builds

### Quick Setup

```bash
# Verify Node.js version
node --version  # Should be v18.0.0+
npm --version   # Should be 8.0.0+

# Clone repository
git clone https://github.com/spacewelder314/AgentCHAT.git
cd AgentCHAT

# Install dependencies
npm install
```

## Development Build

### Quick Development

```bash
# Start development with hot reload (most common)
npm run electron:dev

# This command:
# 1. Starts Vite dev server on port 5173
# 2. Launches Electron with hot reload
# 3. Opens DevTools automatically
# 4. Enables React Fast Refresh
```

### Development Variants

```bash
# Vite dev server only (web testing)
npm run dev

# Electron only (requires manual Vite server)
npm run electron

# Development with debugging
DEBUG=agentchat:* npm run electron:dev

# Development with verbose logging
ELECTRON_ENABLE_LOGGING=true npm run electron:dev
```

## Production Build

### Simple Production Build

```bash
# Quick build for current platform
npm run dist:current

# This command:
# 1. Runs TypeScript compilation
# 2. Builds React app with Vite
# 3. Creates Electron installer for current platform
# 4. Outputs to dist/ directory
```

### Comprehensive Production Build

```bash
# Build for all platforms (all architectures)
npm run dist:maximum

# Build for specific platforms
npm run dist:mac         # macOS (Intel + ARM64 + Universal)
npm run dist:win         # Windows (x64 + x86 + ARM64)
npm run dist:linux       # Linux (x64 + ARM64 + ARMv7l)
```

### Build Components

```bash
# TypeScript compilation only
npx tsc

# Vite build only
npm run build

# Package only (requires built app)
npm run electron:pack
```

## Build Configuration

### Package.json Scripts

The build system is configured through these NPM scripts:

```json
{
  "scripts": {
    "start": "electron .",
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx",
    "test": "jest",
    "electron": "wait-on tcp:5173 && cross-env NODE_ENV=development electron .",
    "electron:dev": "concurrently \"npm run dev\" \"npm run electron\"",
    "dist": "npm run build && electron-builder --mac --win --linux",
    "dist:current": "npm run build && electron-builder",
    "dist:mac": "npm run build && electron-builder --mac",
    "dist:win": "npm run build && electron-builder --win",
    "dist:linux": "npm run build && electron-builder --linux"
  }
}
```

### Vite Configuration

Vite configuration in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  root: '.',
  base: '',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  },
  server: {
    port: 5173,
    host: true,
  },
})
```

### TypeScript Configuration

Main TypeScript configuration in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Build Scripts

### Comprehensive Build Script

The `scripts/build-compile-dist.sh` script provides advanced build capabilities:

```bash
# Complete all-platform build with analysis
./scripts/build-compile-dist.sh

# Build with options
./scripts/build-compile-dist.sh --skip-bloat      # Skip analysis
./scripts/build-compile-dist.sh --skip-temp-clean # Skip cleanup
./scripts/build-compile-dist.sh --help            # Show all options
```

### Build Release Script

The `scripts/build-release-run.sh` script for streamlined building:

```bash
# Current platform build and run
./scripts/build-release-run.sh

# Platform-specific build
./scripts/build-release-run.sh --platform mac
./scripts/build-release-run.sh --platform win
./scripts/build-release-run.sh --platform linux

# Build options
./scripts/build-release-run.sh --build-only    # Build without running
./scripts/build-release-run.sh --clean         # Clean build
./scripts/build-release-run.sh --dev           # Development mode
```

### Utility Scripts

```bash
# Build size analysis
./scripts/bloat-check.sh

# System cleanup
./scripts/temp-cleanup.sh

# Repository cleanup
./scripts/repository-cleanup.sh
```

## Platform-Specific Builds

### macOS Builds

#### Build Variants

```bash
# All macOS variants
npm run dist:mac:all

# Specific architectures
npm run dist:mac:x64        # Intel only
npm run dist:mac:arm64      # Apple Silicon only
npm run dist:mac:universal  # Universal binary (recommended)

# Mac App Store build
npm run dist:mac:store
```

#### Output Files

- `AgentCHAT-1.0.0-universal.dmg` - Universal installer (recommended)
- `AgentCHAT-1.0.0-x64.dmg` - Intel installer
- `AgentCHAT-1.0.0-arm64.dmg` - Apple Silicon installer
- `AgentCHAT-1.0.0.pkg` - macOS installer package
- `AgentCHAT-1.0.0-mac.zip` - Archive version

#### Build Requirements

- macOS 10.15+ for building
- Xcode Command Line Tools
- Apple Developer ID (for distribution)

### Windows Builds

#### Build Variants

```bash
# All Windows variants
npm run dist:win:all

# Specific architectures
npm run dist:win:x64        # 64-bit (recommended)
npm run dist:win:ia32       # 32-bit
npm run dist:win:arm64      # ARM64

# Specific installers
npm run dist:win:msi        # Microsoft Installer
npm run dist:win:portable   # Portable version
npm run dist:win:appx       # Microsoft Store
```

#### Output Files

- `AgentCHAT Setup 1.0.0.exe` - NSIS installer
- `AgentCHAT-1.0.0.msi` - Microsoft Installer
- `AgentCHAT-1.0.0-win.zip` - Portable archive
- `AgentCHAT-1.0.0-arm64.exe` - ARM64 installer
- `AgentCHAT-1.0.0-ia32.exe` - 32-bit installer

#### Build Requirements

- Windows 10/11
- Visual Studio Build Tools 2022
- Windows SDK

### Linux Builds

#### Build Variants

```bash
# All Linux variants
npm run dist:linux:all

# Specific architectures
npm run dist:linux:x64        # 64-bit (recommended)
npm run dist:linux:arm64      # ARM64
npm run dist:linux:armv7l     # ARM 32-bit

# Specific packages
npm run dist:linux:appimage   # AppImage (recommended)
npm run dist:linux:deb        # Debian/Ubuntu
npm run dist:linux:rpm        # Red Hat/Fedora
npm run dist:linux:snap       # Snap Store
```

#### Output Files

- `AgentCHAT-1.0.0.AppImage` - Universal portable
- `agentchat-electron_1.0.0_amd64.deb` - Debian/Ubuntu
- `agentchat-electron-1.0.0.x86_64.rpm` - Red Hat/Fedora
- `agentchat-electron-1.0.0.snap` - Snap package
- `AgentCHAT-1.0.0.tar.xz` - Source archive

#### Build Requirements

```bash
# Ubuntu/Debian
sudo apt-get install build-essential libnss3-dev

# Fedora/CentOS
sudo dnf install @development-tools nss-devel

# Arch Linux
sudo pacman -S base-devel nss
```

## Build Outputs

### Directory Structure

```
dist/                          # Vite build output
├── renderer/                  # React application
│   ├── assets/               # Static assets
│   └── index.html            # Main HTML file

dist/                          # Electron build output
├── mac/                       # macOS builds
│   ├── AgentCHAT-*.dmg       # Disk images
│   ├── AgentCHAT-*.pkg       # Installer packages
│   └── *.zip                  # Archives
├── win/                       # Windows builds
│   ├── *.exe                  # Installers
│   ├── *.msi                  # Microsoft installers
│   └── *.zip                  # Portable archives
└── linux/                     # Linux builds
    ├── *.AppImage             # Portable apps
    ├── *.deb                  # Debian packages
    ├── *.rpm                  # Red Hat packages
    └── *.snap                 # Snap packages
```

### File Naming Convention

Build files follow this naming pattern:
- Application: `AgentCHAT-{version}`
- Version: Semantic versioning (e.g., 1.0.0)
- Platform: Suffix for platform/architecture
- Examples:
  - `AgentCHAT-1.0.0-universal.dmg`
  - `AgentCHAT Setup 1.0.0.exe`
  - `AgentCHAT-1.0.0.AppImage`

## Build Optimization

### Size Optimization

```bash
# Analyze build sizes
./scripts/bloat-check.sh

# Optimize dependencies
npm audit fix
npm dedupe

# Tree-shaking configuration
# Vite automatically tree-shakes unused code
```

### Build Performance

```bash
# Parallel builds
# Electron Builder automatically builds in parallel where possible

# Incremental builds
# Vite caches builds for faster subsequent builds

# Memory optimization
# Limit concurrent builds on systems with low RAM
```

### Code Splitting

The application uses Vite's automatic code splitting:
- Dynamic imports for large dependencies
- Vendor chunks for third-party libraries
- CSS chunks for styles

## Troubleshooting

### Common Build Issues

#### TypeScript Compilation Errors

```bash
# Check TypeScript version
npx tsc --version

# Detailed error output
npx tsc --noEmit

# Update TypeScript
npm install typescript@latest
```

#### Node Module Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

#### Electron Builder Issues

```bash
# Check Electron Builder version
npx electron-builder --version

# Verbose build output
DEBUG=electron-builder npm run dist

# Clean build artifacts
rm -rf dist build release
```

#### Platform-Specific Issues

**macOS Code Signing**
```bash
# Check certificate
security find-identity -v -p codesigning

# Manual signing
codesign --deep --force --verify --verbose --sign "Developer ID Application" AgentCHAT.app
```

**Windows DLL Errors**
```bash
# Install Visual C++ Redistributable
# Download from Microsoft website
```

**Linux Library Dependencies**
```bash
# Check dependencies
ldd AgentCHAT.AppImage

# Install missing libraries
sudo apt-get install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6
```

### Build Performance Issues

```bash
# Check system resources
htop  # Linux/macOS
tasklist  # Windows

# Limit parallel builds
ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES=true npm run dist

# Use less memory
NODE_OPTIONS="--max-old-space-size=4096" npm run dist
```

### Debug Mode Builds

```bash
# Development build with debugging
npm run electron:dev

# Production build with DevTools
npm run build
npm run electron:preview

# Verbose logging
DEBUG=* npm run electron:dev
```

## Advanced Build Configuration

### Custom Electron Builder Config

Create `electron-builder.yml` for custom configuration:

```yaml
appId: com.agentchat.desktop
productName: AgentCHAT
copyright: Copyright © 2024

directories:
  output: dist
  buildResources: build_resources

files:
  - dist/renderer/**/*
  - src/main.cjs
  - src/preload.cjs
  - "!**/*.ts"
  - "!**/*.map"

mac:
  category: public.app-category.productivity
  icon: build_resources/icons/icon.icns
  target:
    - target: dmg
      arch:
        - x64
        - arm64

win:
  icon: build_resources/icons/icon.ico
  target:
    - target: nsis
      arch:
        - x64

linux:
  icon: build_resources/icons
  category: Utility
  target:
    - target: AppImage
      arch:
        - x64
```

### Environment Variables

```bash
# Development
NODE_ENV=development
DEBUG=agentchat:*

# Production
NODE_ENV=production
ELECTRON_IS_DEV=0

# Build
ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES=true
CSC_LINK=path/to/certificate.p12
CSC_KEY_PASSWORD=password
```

## CI/CD Integration

### GitHub Actions

Example workflow for automated builds:

```yaml
name: Build and Release
on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]

    runs-on: ${{ matrix.os }}

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build

    - name: Build Electron app
      run: npm run dist
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: ${{ matrix.os }}-build
        path: dist/
```

---

**For more help:**
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed issue resolution
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for system understanding
- Open an issue on GitHub for build-related problems