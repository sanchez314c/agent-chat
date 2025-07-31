# AgentCHAT Installation Guide

## Download Pre-built Releases

Download the latest release for your platform from:
**[GitHub Releases](https://github.com/sanchez314c/AgentCHAT/releases)**

### macOS
- **DMG**: `AgentCHAT-{version}.dmg` - Drag to Applications
- **ZIP**: `AgentCHAT-{version}-mac.zip` - Extract and run
- **PKG**: `AgentCHAT-{version}.pkg` - Installer package

### Windows
- **EXE**: `AgentCHAT Setup {version}.exe` - NSIS installer
- **MSI**: `AgentCHAT-{version}.msi` - Windows Installer
- **Portable**: `AgentCHAT-{version}-portable.exe` - No install required

### Linux
- **AppImage**: `AgentCHAT-{version}.AppImage` - Universal (recommended)
- **DEB**: `AgentCHAT-{version}.deb` - Debian/Ubuntu
- **RPM**: `AgentCHAT-{version}.rpm` - Fedora/RHEL
- **Snap**: Available in Snap Store
- **TAR**: `AgentCHAT-{version}.tar.xz` - Manual extraction

## Install from Pre-built

### macOS

```bash
# DMG
open AgentCHAT-{version}.dmg
# Drag AgentCHAT to Applications

# Or via ZIP
unzip AgentCHAT-{version}-mac.zip
mv AgentCHAT.app /Applications/
```

### Windows

1. Download `AgentCHAT Setup {version}.exe`
2. Run installer
3. Follow installation wizard
4. Launch from Start Menu or Desktop

### Linux

**AppImage (Recommended):**
```bash
chmod +x AgentCHAT-{version}.AppImage
./AgentCHAT-{version}.AppImage
```

**Debian/Ubuntu:**
```bash
sudo dpkg -i AgentCHAT-{version}.deb
sudo apt-get install -f  # Fix dependencies if needed
```

**Fedora/RHEL:**
```bash
sudo rpm -i AgentCHAT-{version}.rpm
```

## Install from Source

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Steps

```bash
# Clone
git clone https://github.com/sanchez314c/AgentCHAT.git
cd AgentCHAT

# Install dependencies
npm install

# Run from source
npm run electron:dev

# Or build for your platform
npm run dist:current
```

## Post-Installation Setup

### 1. Launch Application
- Find AgentCHAT in your applications
- Or run from terminal/command prompt

### 2. Configure API Keys
- Click the key icon or settings
- Enter API keys for your AI providers:
  - Anthropic (Claude)
  - OpenAI (GPT-4)
  - Google (Gemini)
  - OpenRouter

### 3. Create Agents
- Configure Agent A and Agent B
- Select AI provider and model
- Set personality/system prompt

### 4. Start Conversation
- Enter initial topic
- Click "Start Conversation"
- Watch agents converse!

## System Requirements

| Platform | Minimum | Recommended |
|----------|---------|-------------|
| **OS** | macOS 10.15+, Windows 10+, Linux (glibc 2.17+) | Latest versions |
| **RAM** | 4 GB | 8 GB+ |
| **Storage** | 200 MB | 500 MB |
| **Display** | 1280x720 | 1920x1080+ |

## Troubleshooting Installation

### macOS: "App is damaged"
```bash
xattr -cr /Applications/AgentCHAT.app
```

### Linux: Sandbox Error
```bash
sudo sysctl -w kernel.unprivileged_userns_clone=1
# Or run with --no-sandbox
```

### Windows: Missing DLLs
Install [Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe)

## Quick Start

Get up and running in 5 minutes:

1. **Download** from [Releases](https://github.com/sanchez314c/agent-chat/releases) or clone the repo
2. **Install** for your platform (see above)
3. **Launch** AgentCHAT
4. **Configure** API key (click key icon in header)
5. **Start chatting**

### Example Setup

**Agent A:**
```
Provider: Anthropic
Model: Claude 3.5 Sonnet
Persona: You are an optimistic futurist who believes technology will solve humanity's problems.
```

**Agent B:**
```
Provider: OpenAI
Model: GPT-4
Persona: You are a cautious ethicist who questions the implications of new technologies.
```

**Topic:** "Should we pursue artificial general intelligence?"

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Conversation | `Ctrl/Cmd + N` |
| Save Conversation | `Ctrl/Cmd + S` |
| Stop Conversation | `Escape` |

### Tips

- **Mix providers** for more interesting debates between different AI models
- **Detailed personas** lead to better conversations
- **Adjust temperature** (higher = more creative, lower = more focused)
- **Operator injection** lets you steer a running conversation in real-time
