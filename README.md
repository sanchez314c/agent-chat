# AgentCHAT Desktop

> Multi-agent AI conversation desktop application built with Electron, React, and TypeScript

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)

A powerful multi-agent AI conversation desktop application built with Electron, React, and TypeScript. Engage with multiple AI agents simultaneously in an intuitive, modern interface.

![AgentCHAT Desktop](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)

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
- Node.js 16.0.0 or higher
- npm 7.0.0 or higher
- API key from at least one supported AI provider

### One-Command Build & Run

```bash
# Clone the repository
git clone <repository-url>
cd AgentCHAT

# Build, release, and run with one command!
./build-release-run.sh
```

### Development Mode

```bash
# Run in development mode with hot reload
./build-release-run.sh --dev
```

### Build Options

```bash
# Build for specific platform
./build-release-run.sh --platform mac    # macOS only
./build-release-run.sh --platform win    # Windows only
./build-release-run.sh --platform linux  # Linux only
./build-release-run.sh --platform all    # All platforms

# Build without running
./build-release-run.sh --build-only

# Quick build (skip Vite rebuild)
./build-release-run.sh --quick

# Clean build
./build-release-run.sh --clean
```

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
├── 🎯 Core Files
│   ├── build-release-run.sh # Unified build script
│   ├── package.json         # Dependencies and scripts
│   ├── index.html           # Entry HTML
│   └── LICENSE              # MIT license
├── 🖥️ Electron
│   ├── electron/            # Electron main process
│   │   ├── main.cjs        # Application entry point
│   │   └── preload.cjs     # Secure API bridge
├── 🎨 Frontend Source
│   ├── src/                 # React frontend source
│   │   ├── components/      # UI components
│   │   │   ├── AgentConfigPanel.tsx
│   │   │   ├── ConversationPanel.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── StatusBar.tsx
│   │   │   └── APIKeyModal.tsx
│   │   ├── services/        # API clients and logic
│   │   │   ├── APIClient.ts
│   │   │   └── AgentManager.ts
│   │   ├── types/           # TypeScript definitions
│   │   ├── App.tsx          # Main React component
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Global styles
├── 🎯 Resources
│   ├── assets/              # Application icons
│   │   ├── icon.icns       # macOS icon
│   │   ├── icon.ico        # Windows icon
│   │   └── icon.png        # PNG icon
│   └── public/              # Static assets
├── 📦 Build Output
│   ├── dist/                # Vite build output
│   └── release/             # Packaged applications
│       └── {version}/       # Version-specific builds
├── 🔧 Configuration
│   ├── vite.config.ts       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS config
│   ├── tsconfig.json        # TypeScript config
│   └── postcss.config.js    # PostCSS config
└── 📚 Development
    └── dev/                 # Development files
        ├── build.sh.old     # Legacy build scripts
        ├── requirements.txt # System requirements
        └── ...              # Other dev files
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