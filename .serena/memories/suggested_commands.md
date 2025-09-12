# AgentCHAT Development Commands

## Development Commands

### Primary Development
```bash
# Run in development mode (most common)
npm run electron:dev     # Vite dev server + Electron with hot reload

# Alternative development commands
npm run dev              # Vite dev server only (for web testing)
npm run electron         # Electron only (requires Vite server running)
```

### Building & Distribution
```bash
# Build the application
npm run build            # TypeScript compilation + Vite build

# Package for distribution
npm run dist             # Full production build for current platform
npm run dist:current     # Same as above
npm run dist:win         # Build for Windows
npm run dist:mac         # Build for macOS  
npm run dist:linux       # Build for Linux

# Quick preview of built app
npm run preview          # Vite preview server
npm run electron:preview # Run built version in Electron
```

### Code Quality
```bash
npm run lint             # Run ESLint on TypeScript files
```

### Unified Build Script (Recommended)
```bash
# Primary build script with options
./build-release-run.sh                    # Build and run for current platform
./build-release-run.sh --dev              # Development mode
./build-release-run.sh --platform win     # Build for Windows
./build-release-run.sh --platform mac     # Build for macOS
./build-release-run.sh --platform linux   # Build for Linux
./build-release-run.sh --platform all     # Build for all platforms
./build-release-run.sh --build-only       # Build without running
./build-release-run.sh --clean            # Clean build
./build-release-run.sh --quick            # Quick build (skip Vite)
```

## macOS System Commands
```bash
# File operations
ls -la                   # List files with details
find . -name "*.ts"      # Find TypeScript files
grep -r "search_term" .  # Search in files

# Process management  
ps aux | grep node       # Find Node processes
killall node            # Kill all Node processes
lsof -i :5173           # Check what's using port 5173

# Git operations
git status              # Check repository status
git branch             # List branches
git log --oneline      # Commit history
```

## Task Completion Checklist
After implementing features:
1. Run `npm run lint` to check code quality
2. Test with `npm run electron:dev`
3. Build with `npm run build` to verify compilation
4. Test production build with `npm run electron:preview`