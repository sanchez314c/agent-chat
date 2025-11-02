# AgentCHAT Desktop

> Multi-agent AI conversation desktop application built with Electron, React, and TypeScript

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.9+-blue.svg)
![Electron](https://img.shields.io/badge/electron-39.0+-blue.svg)
![React](https://img.shields.io/badge/react-19.2+-blue.svg)

![AgentCHAT Screenshot](https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/814a456e-a24c-443c-9cd1-60a1e36b13b0/d34d4aaffc6723a7e452781829dfa6ef.jpg?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1762053749&Signature=IFS+9i04VlrXA0428mrI2R2P7o0=)

A powerful multi-agent AI conversation desktop application built with Electron, React, and TypeScript. Engage with multiple AI agents simultaneously in an intuitive, modern interface.

## ✨ Features

### 🤖 Multi-Agent Support
- **Claude (Anthropic)** - Advanced reasoning and analysis
- **GPT-4/GPT-3.5 (OpenAI)** - Versatile conversational AI
- **Gemini (Google)** - Large context window support
- **OpenRouter** - Access to multiple open-source models
- **Simultaneous Conversations** - Chat with multiple agents at once

### 🔒 Security & Privacy
- **Encrypted API Key Storage** - Secure local storage using electron-store
- **No Data Logging** - Conversations stay on your device
- **Sandboxed Environment** - Isolated web content for security
- **Context Isolation** - Secure IPC communication

### 💡 User Experience
- **Dark Theme Interface** - Modern, comfortable design
- **Real-time Streaming** - See responses as they're generated
- **Conversation Export** - Save chats as Markdown or text files
- **Keyboard Shortcuts** - Efficient navigation and actions
- **Cross-Platform** - Native apps for Windows, macOS, and Linux
- **Agent Differentiation** - Color-coded agents for easy identification

### 🛠️ Developer Features
- **TypeScript** - Full type safety throughout
- **Hot Reload** - Fast development iteration
- **ESLint** - Code quality enforcement
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- API key from at least one supported AI provider

### One-Command Build & Run

```bash
# Clone the repository
git clone https://github.com/spacewelder314/AgentCHAT.git
cd AgentCHAT

# Install dependencies
npm install

# Quick development mode
npm run electron:dev

# OR check build status with framework tools
npm run bloat-check
```

### Comprehensive Build System

#### Development Mode
```bash
# Fast development with hot reload
npm run electron:dev

# OR using comprehensive build script
./scripts/build-compile-dist.sh --help
```

#### Production Builds

**Simple Build (Current Platform)**
```bash
npm run dist:current
```

**Platform-Specific Builds**
```bash
npm run dist:mac         # macOS (Intel + ARM64 + Universal)
npm run dist:win         # Windows (x64 + x86 + ARM64)
npm run dist:linux       # Linux (x64 + ARM64 + ARMv7l)
```

**Comprehensive All-Platform Build**
```bash
# NEW: Complete build system with all variants
./scripts/build-compile-dist.sh

# Build with bloat analysis and optimization
./scripts/build-compile-dist.sh --skip-bloat     # Faster build
./scripts/build-compile-dist.sh --skip-temp-clean # Skip cleanup
```

**Quick Build Options**
```bash
./scripts/build-release-run.sh --platform mac    # macOS only
./scripts/build-release-run.sh --platform win    # Windows only
./scripts/build-release-run.sh --platform linux  # Linux only
./scripts/build-release-run.sh --build-only      # Build without running
./scripts/build-release-run.sh --quick           # Skip rebuild
```

### Build Output Locations

Built applications are saved to `dist/` directory:

#### All Platform Variants Generated:
- **macOS**:
  - `AgentCHAT-{version}.dmg` (Intel x64)
  - `AgentCHAT-{version}-arm64.dmg` (Apple Silicon)
  - `AgentCHAT-{version}-universal.dmg` (Intel + ARM)
  - `AgentCHAT-{version}.pkg` (macOS installer)
  - `AgentCHAT-{version}-mac.zip` (Archive)

- **Windows**:
  - `AgentCHAT Setup {version}.exe` (NSIS installer)
  - `AgentCHAT-{version}.msi` (Microsoft installer)
  - `AgentCHAT-{version}-win.zip` (Portable)
  - `win-x64-unpacked/`, `win-x32-unpacked/`, `win-arm64-unpacked/` (Raw builds)

- **Linux**:
  - `AgentCHAT-{version}.AppImage` (Universal portable)
  - `agentchat-electron_{version}_amd64.deb` (Debian/Ubuntu x64)
  - `agentchat-electron_{version}_arm64.deb` (ARM64)
  - `agentchat-electron_{version}_armv7l.deb` (ARMv7)
  - `.rpm`, `.snap`, `.tar.gz`, `.tar.xz` packages available
  - `linux-unpacked/`, `linux-arm64-unpacked/`, `linux-armv7l-unpacked/` (Raw builds)

## 📦 Distribution

### Unified Build System

The `build-release-run.sh` script handles everything:
- TypeScript compilation
- Vite bundling
- Electron packaging
- Platform-specific installers
- Automatic launch after build

### Output Locations

Built applications are saved to `release/{version}/` directory:
- **macOS**: 
  - `AgentCHAT-{version}.dmg` (Intel)
  - `AgentCHAT-{version}-arm64.dmg` (Apple Silicon)
- **Windows**: 
  - `AgentCHAT Setup {version}.exe` (Installer)
  - `win-unpacked/` (Portable version)
- **Linux**: 
  - `AgentCHAT-{version}.AppImage` (Universal)
  - `agentchat-electron_{version}_amd64.deb` (Debian/Ubuntu)
  - `linux-unpacked/` (Raw files)

## 🔧 Configuration

### API Keys Setup

1. Launch the application
2. Click on the gear icon for each agent panel
3. Enter your API keys from supported providers:

#### Supported Providers

##### Anthropic Claude
- **Website**: https://anthropic.com/
- **API Keys**: https://console.anthropic.com/settings/keys
- **Models**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku

##### OpenAI
- **Website**: https://openai.com/
- **API Keys**: https://platform.openai.com/api-keys
- **Models**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo

##### Google Gemini
- **Website**: https://ai.google.dev/
- **API Keys**: https://aistudio.google.com/app/apikey
- **Models**: Gemini 1.5 Pro, Gemini 1.5 Flash

##### OpenRouter
- **Website**: https://openrouter.ai/
- **API Keys**: https://openrouter.ai/keys
- **Models**: Llama, Mixtral, Gemma, and more open-source models

## 🎯 Usage

### Basic Workflow

1. **Configure Agents**: Set up both agents with desired providers, models, and personas
2. **Set System Prompts**: Configure agent behavior and personalities
3. **Start Conversation**: Click "Start" to begin the agent conversation
4. **Monitor Progress**: Watch real-time conversation between agents
5. **Control Flow**: Pause, resume, or stop conversations as needed
6. **Export Results**: Save conversations as Markdown files

### Agent Configuration Options

Each agent can be customized with:

- **Display Name**: Custom name for the agent
- **AI Provider**: Choose from Anthropic, OpenAI, Google, or OpenRouter
- **Model Selection**: Specific model variant (GPT-4, Claude-3-Opus, etc.)
- **System Persona**: Character description and behavior instructions
- **Temperature**: Creativity level (0.0 = focused, 2.0 = highly creative)
- **Max Tokens**: Maximum response length limit
- **Context Window**: Available context for the conversation

### Conversation Controls

- **Start**: Begin a new conversation between agents
- **Pause**: Temporarily halt the ongoing conversation
- **Resume**: Continue a paused conversation
- **Stop**: End the current conversation completely
- **New Conversation**: Clear history and start fresh
- **Save Conversation**: Export as Markdown (.md) or text (.txt)

### Keyboard Shortcuts

- **New Conversation**: `Cmd/Ctrl + N`
- **Save Conversation**: `Cmd/Ctrl + S`
- **Toggle DevTools**: `Cmd/Ctrl + Shift + I`
- **Reload Application**: `Cmd/Ctrl + R`
- **Zoom In/Out**: `Cmd/Ctrl + Plus/Minus`
- **Reset Zoom**: `Cmd/Ctrl + 0`

## 🏗️ Development

### Project Structure
```
AgentCHAT/
├── 📄 Core Files
│   ├── README.md            # Main documentation
│   ├── LICENSE              # MIT license
│   ├── package.json         # Dependencies and scripts
│   ├── index.html           # Application entry point
│   └── CLAUDE.md            # Claude Code development guide
├── 🔧 Configuration
│   ├── vite.config.ts       # Vite build configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── tsconfig.json        # TypeScript configuration
│   ├── tsconfig.node.json   # Node.js TypeScript config
│   ├── postcss.config.js    # PostCSS configuration
│   └── .eslintrc.json       # ESLint configuration
├── 🖥️ Electron Main Process
│   ├── src/main.cjs         # Electron application entry point
│   └── src/preload.cjs      # Secure IPC bridge
├── 🎨 React Frontend (src/)
│   ├── components/          # UI components
│   │   ├── AgentConfigPanel.tsx    # Agent configuration
│   │   ├── ConversationPanel.tsx   # Chat interface
│   │   ├── MessageBubble.tsx       # Message display
│   │   ├── StatusBar.tsx           # Status information
│   │   └── APIKeyModal.tsx         # API key management
│   ├── services/           # Business logic
│   │   ├── APIClient.ts            # AI provider API clients
│   │   └── AgentManager.ts         # Agent orchestration
│   ├── types/              # TypeScript definitions
│   │   └── index.ts                # Core type definitions
│   ├── App.tsx             # Main React application
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
├── 📚 Documentation
│   ├── docs/                # Extended documentation
│   │   ├── CONTRIBUTING.md   # Contribution guidelines
│   │   ├── DEVELOPMENT.md    # Development setup
│   │   ├── SECURITY.md       # Security information
│   │   ├── TECH-STACK.md     # Technology stack details
│   │   ├── PRD.md            # Product requirements
│   │   ├── TODO.md           # Development roadmap
│   │   ├── LEARNINGS.md      # Project learnings
│   │   ├── BUILD.md          # Build system documentation
│   │   ├── FAQ.md            # Frequently asked questions
│   │   ├── QUICK_START.md    # Quick start guide
│   │   ├── INSTALLATION.md   # Installation instructions
│   │   ├── TROUBLESHOOTING.md # Troubleshooting guide
│   │   └── WORKFLOW.md       # Development workflow
│   └── .github/             # GitHub configuration
│       ├── workflows/       # CI/CD workflows
│       ├── ISSUE_TEMPLATE/  # Issue templates
│       └── PULL_REQUEST_TEMPLATE.md
├── 🛠️ Build System
│   └── scripts/             # Build and utility scripts
│       ├── build-compile-dist.sh   # Comprehensive all-platform build
│       ├── build-release-run.sh     # Unified build and run
│       ├── compile-build-dist.sh    # Production build system
│       ├── bloat-check.sh           # Build size analysis
│       └── temp-cleanup.sh          # System cleanup utilities
├── 🎨 Assets & Resources
│   ├── build-resources/     # Build assets
│   │   └── icons/          # Application icons
│   │       ├── icon.icns    # macOS icon
│   │       ├── icon.ico     # Windows icon
│   │       └── icon.png     # PNG source
│   └── screenshots/         # Application screenshots
├── 📦 Build Output
│   ├── dist/                # All built applications and packages
│   ├── build/               # Temporary build files
│   └── node_modules/        # Node.js dependencies
└── 🔧 Development Tools
    ├── tests/               # Test directories (unit, integration, e2e)
    ├── .serena/             # Project memories and context
    ├── .git/                # Git repository
    └── .github/             # GitHub configuration
```

### Build Script Usage

```bash
# Main build script
./build-release-run.sh [options]

Options:
  --dev          Run in development mode (Vite + Electron)
  --build-only   Build release but don't run
  --clean        Clean build artifacts before building
  --platform     Platform to build for (mac, win, linux, all)
  --quick        Quick build using existing dist (skip Vite build)
  --help         Show help message

# Examples:
./build-release-run.sh                    # Build and run for macOS
./build-release-run.sh --platform win     # Build for Windows
./build-release-run.sh --dev              # Development mode
./build-release-run.sh --clean --platform all  # Clean build for all platforms
```

### NPM Scripts (Advanced)

```bash
# Development
npm run dev              # Vite dev server only
npm run electron:dev     # Full dev mode (Vite + Electron)

# Building
npm run build           # TypeScript + Vite build
npm run dist            # Full production build

# Code Quality
npm run lint            # Run ESLint
```

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Desktop Framework**: Electron 25 with secure IPC
- **Build Tool**: Vite 4 for fast development and building
- **Styling**: Tailwind CSS 3 with dark theme
- **Icons**: Lucide React icon library
- **Storage**: electron-store with encryption
- **Code Quality**: ESLint with TypeScript rules
- **Packaging**: electron-builder for multi-platform distribution

## 🔍 Troubleshooting

### Common Issues

#### Application Won't Start
- **Check Node.js version**: Ensure Node.js 16+ is installed
- **Reinstall dependencies**: `rm -rf node_modules && npm install`
- **Port conflicts**: Ensure port 5173 is available
- **Platform compatibility**: Verify OS compatibility

#### Blank White Screen
- **Asset loading**: Check if CSS/JS files are loading properly
- **Console errors**: Open DevTools and check for JavaScript errors
- **File paths**: Ensure dist/ folder contains built files
- **Rebuild**: Run `npm run build` to regenerate assets

#### API Connection Issues
- **API keys**: Verify all API keys are correctly configured
- **Network**: Check internet connection and firewall settings
- **Provider status**: Check if AI provider services are operational
- **Rate limits**: Ensure API quotas haven't been exceeded
- **Model availability**: Confirm selected models are accessible

#### Build/Packaging Errors
- **Dependencies**: Update all packages to latest versions
- **Platform tools**: Install platform-specific build tools
- **Disk space**: Ensure sufficient storage for build process
- **Permissions**: Check file system permissions

### Debug Mode
Enable detailed logging:
```bash
# Development with debug output
DEBUG=agentchat:* npm run electron:dev

# Enable Electron debug logging
ELECTRON_ENABLE_LOGGING=true npm run electron:dev
```

### Performance Optimization
- **Memory usage**: Monitor with DevTools Performance tab
- **API response times**: Check network requests in DevTools
- **UI responsiveness**: Use React Developer Tools for component analysis

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started
1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `npm install`
5. Start development server: `npm run electron:dev`

### Development Guidelines
- **Code Style**: Follow existing TypeScript and React patterns
- **Components**: Use functional components with hooks
- **Types**: Add TypeScript types for all new interfaces
- **Styling**: Use Tailwind CSS utility classes
- **Testing**: Test on multiple platforms before submitting
- **Commits**: Use descriptive commit messages

### Pull Request Process
1. Ensure code passes ESLint: `npm run lint`
2. Test on at least one platform thoroughly
3. Update documentation if needed
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request with detailed description

## 📚 Documentation

**📋 Complete Documentation Index**: [Documentation Index](docs/DOCUMENTATION_INDEX.md) - Comprehensive guide to all documentation
**Phase 4 Status**: ✅ Complete - Repository documentation fully standardized and professional-grade

### 🚀 Getting Started
- **[Quick Start Guide](docs/QUICK_START.md)** - Get AgentCHAT running in 5 minutes
- **[Installation Guide](docs/INSTALLATION.md)** - Detailed installation instructions
- **[FAQ](docs/FAQ.md)** - Frequently asked questions

### 🛠️ Development
- **[Development Guide](docs/DEVELOPMENT.md)** - Development setup and workflow
- **[Build & Compile Guide](docs/BUILD_COMPILE.md)** - Comprehensive build documentation
- **[Contributing Guide](docs/CONTRIBUTING.md)** - How to contribute
- **[Development Workflow](docs/WORKFLOW.md)** - Complete development workflow

### 📖 Reference
- **[API Documentation](docs/API.md)** - API reference and integration guide
- **[Architecture](docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[Technology Stack](docs/TECHSTACK.md)** - Technology details and architecture
- **[Security](SECURITY.md)** - Security information and best practices (also available in [docs/SECURITY.md](docs/SECURITY.md))
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Product Requirements](docs/PRD.md)** - Product specifications and features

### 📋 Project
- **[Learnings](docs/LEARNINGS.md)** - Development insights and lessons learned
- **[Code of Conduct](docs/CODE_OF_CONDUCT.md)** - Community guidelines
- **[Changelog](CHANGELOG.md)** - Version history and updates
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deployment and distribution instructions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for complete details.

## 🙏 Acknowledgments

### AI Providers
- **Anthropic** - Claude API and advanced reasoning capabilities
- **OpenAI** - GPT models and API infrastructure
- **Google** - Gemini models and large context windows
- **OpenRouter** - Access to open-source model ecosystem

### Technology Stack
- **Electron Team** - Cross-platform desktop framework
- **React Team** - Component-based UI library
- **Vite Team** - Lightning-fast build tool
- **Tailwind Labs** - Utility-first CSS framework
- **TypeScript Team** - Type-safe JavaScript

### Community
- **Contributors** - Everyone who has contributed code, ideas, or feedback
- **Users** - Beta testers and early adopters
- **Open Source Community** - For the foundational tools and libraries

## 📊 System Requirements

### Minimum Requirements
- **Operating System**: 
  - Windows 10 version 1903 or later
  - macOS 10.14 Mojave or later
  - Ubuntu 18.04 LTS or equivalent Linux distribution
- **RAM**: 4GB minimum
- **Storage**: 500MB free space for installation
- **CPU**: x64 or ARM64 architecture
- **Internet**: Broadband connection for AI API calls

### Recommended Requirements
- **RAM**: 8GB or more for optimal performance
- **Storage**: 1GB free space for conversations and updates
- **Display**: 1920x1080 resolution or higher
- **Internet**: Stable broadband with low latency

### Development Requirements
- **Node.js**: 16.0.0 or higher (latest LTS recommended)
- **npm**: 7.0.0 or higher (comes with Node.js)
- **Git**: Latest version for version control
- **Code Editor**: VS Code recommended with TypeScript support

---

## 🚀 What's Next?

### Planned Features
- **Plugin System**: Support for custom AI providers
- **Conversation Templates**: Pre-built scenarios and use cases
- **Advanced Export**: PDF, HTML, and other format support
- **Collaboration**: Share conversations with team members
- **Voice Integration**: Text-to-speech and speech-to-text
- **Mobile Companion**: iOS and Android apps

### Roadmap
- **v1.1**: Plugin architecture and custom providers
- **v1.2**: Advanced conversation management
- **v1.3**: Collaboration and sharing features
- **v2.0**: Voice integration and mobile apps

---

**Built with ❤️ for the AI community**

For support, feature requests, or bug reports, please open an issue on GitHub or reach out to the development team.