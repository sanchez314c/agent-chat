# Installation Guide

Complete installation instructions for AgentCHAT on all supported platforms.

## System Requirements

### Minimum Requirements
- **Operating System**:
  - macOS 10.15 (Catalina) or higher
  - Windows 10 (Version 1903) or higher
  - Ubuntu 20.04+ / CentOS 8+ / modern Linux distributions
- **Memory**: 4GB RAM
- **Storage**: 500MB free disk space
- **Network**: Internet connection for AI provider APIs

### Recommended Requirements
- **Memory**: 8GB RAM or higher
- **Storage**: 2GB free disk space
- **Processor**: Modern multi-core CPU
- **Display**: 1920x1080 resolution or higher

## Installation Methods

### Method 1: Pre-built Application (Recommended)

#### macOS Installation

1. **Download the application**:
   - Visit [Releases](https://github.com/spacewelder314/AgentCHAT/releases)
   - Download `AgentCHAT-1.0.0-universal.dmg` (recommended for all Macs)

2. **Install the application**:
   - Double-click the downloaded DMG file
   - Drag AgentCHAT into your Applications folder
   - Eject the DMG disk image

3. **Launch the application**:
   - Open Applications folder
   - Double-click AgentCHAT
   - **First-time security warning**:
     - If you see "AgentCHAT can't be opened because Apple cannot check it for malicious software"
     - Go to System Preferences → Security & Privacy
     - Click "Open Anyway" under "Allow apps downloaded from"

4. **Add to Dock (optional)**:
   - Right-click the AgentCHAT icon in Dock
   - Select "Options" → "Keep in Dock"

#### Windows Installation

1. **Download the installer**:
   - Visit [Releases](https://github.com/spacewelder314/AgentCHAT/releases)
   - Download `AgentCHAT-Setup-1.0.0.exe`

2. **Run the installer**:
   - Double-click the downloaded file
   - Click "Yes" if Windows Security prompts you
   - Follow the installation wizard:
     - Accept the license agreement
     - Choose installation location (default is recommended)
     - Select "Create desktop shortcut" for easy access
     - Click "Install" and wait for completion

3. **Launch the application**:
   - Double-click the desktop shortcut
   - Or find AgentCHAT in Start Menu

4. **Windows Defender/SmartScreen**:
   - If Windows Defender SmartScreen blocks the application
   - Click "More info" → "Run anyway"
   - This is normal for new applications

#### Linux Installation

**Option A: AppImage (Recommended - No installation required)**

1. **Download the AppImage**:
   - Visit [Releases](https://github.com/spacewelder314/AgentCHAT/releases)
   - Download `AgentCHAT-1.0.0.AppImage`

2. **Make it executable**:
   ```bash
   chmod +x AgentCHAT-1.0.0.AppImage
   ```

3. **Run the application**:
   ```bash
   ./AgentCHAT-1.0.0.AppImage
   ```

4. **Create desktop shortcut (optional)**:
   ```bash
   # Create a .desktop file
   cat > ~/.local/share/applications/AgentCHAT.desktop << EOF
   [Desktop Entry]
   Name=AgentCHAT
   Exec=/path/to/AgentCHAT-1.0.0.AppImage
   Icon=/path/to/icon.png
   Type=Application
   Categories=Office;
   EOF
   ```

**Option B: DEB Package (Debian/Ubuntu)**

1. **Download the DEB package**:
   - Download `agentchat_1.0.0_amd64.deb`

2. **Install the package**:
   ```bash
   sudo dpkg -i agentchat_1.0.0_amd64.deb
   sudo apt-get install -f  # Fix any missing dependencies
   ```

3. **Launch from applications menu** or run:
   ```bash
   agentchat
   ```

**Option C: RPM Package (Red Hat/Fedora)**

1. **Download the RPM package**:
   - Download `agentchat-1.0.0.x86_64.rpm`

2. **Install the package**:
   ```bash
   sudo rpm -i agentchat-1.0.0.x86_64.rpm
   # or for Fedora/CentOS
   sudo dnf install agentchat-1.0.0.x86_64.rpm
   ```

### Method 2: Build from Source

#### Prerequisites
- **Node.js**: Version 16.x or higher
- **npm**: Version 7.x or higher
- **Git**: For cloning the repository

#### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/spacewelder314/AgentCHAT.git
   cd AgentCHAT
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run electron:dev
   ```

4. **Build for production** (optional):
   ```bash
   npm run build
   npm run electron:preview
   ```

#### Development Build Commands

```bash
# Development with hot reload
npm run electron:dev

# Build only
npm run build

# Run tests (when available)
npm test

# Lint code
npm run lint

# Build for current platform
npm run dist:current

# Build for all platforms
npm run dist:maximum
```

## Post-Installation Setup

### 1. Configure API Keys

After launching AgentCHAT for the first time:

1. **Click "Configure API Keys"** in the top-right corner
2. **Select a provider** from the dropdown menu
3. **Enter your API key**:
   - **OpenRouter**: Get key from [openrouter.ai](https://openrouter.ai)
   - **Anthropic**: Get key from [console.anthropic.com](https://console.anthropic.com)
   - **OpenAI**: Get key from [platform.openai.com](https://platform.openai.com)
   - **Others**: See [TECHSTACK.md](./TECHSTACK.md) for full list
4. **Click "Save"** to store your key securely

### 2. Configure Your First Agents

1. **Click "Agent Configuration"** to open the settings panel
2. **Configure Agent 1**:
   - Name: "Assistant 1"
   - Provider: Select your configured provider
   - Model: Choose a model (e.g., Claude 3.5 Sonnet)
   - Persona: "You are a helpful AI assistant. Be friendly and informative."
3. **Configure Agent 2**:
   - Name: "Assistant 2"
   - Provider: Same or different provider
   - Model: Choose a model
   - Persona: "You are a creative AI. Think innovatively and suggest new ideas."

### 3. Test the Installation

1. **Click "Start Conversation"**
2. **Verify both agents respond**
3. **Type a test message** to join the conversation
4. **Save the conversation** using File → Save Conversation

## Troubleshooting Installation Issues

### macOS Issues

**"AgentCHAT can't be opened because Apple cannot check it for malicious software"**
- Go to System Preferences → Security & Privacy
- Click "Open Anyway" under "Allow apps downloaded from"
- Try launching again

**"Application is damaged"**
- Re-download the DMG file
- Try a different browser if download was corrupted
- Run this command in Terminal to remove quarantine attribute:
  ```bash
  xattr -d com.apple.quarantine /Applications/AgentCHAT.app
  ```

### Windows Issues

**"Windows Defender SmartScreen prevented this app from starting"**
- Click "More info"
- Click "Run anyway"
- This is normal for new applications

**"The application failed to start properly"**
- Install [Microsoft Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist)
- Run Windows Update
- Try installing as administrator

### Linux Issues

**"Permission denied" when running AppImage**
```bash
chmod +x AgentCHAT-1.0.0.AppImage
```

**"Missing dependencies" on Ubuntu/Debian**
```bash
sudo apt-get update
sudo apt-get install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libuuid1 libsecret-1-0
```

**"Missing dependencies" on Fedora/CentOS**
```bash
sudo dnf install gtk3 libnotify nss libXScrnSaver libXtst xdg-utils at-spi2-core libuuid libsecret
```

### General Issues

**Application won't start**
- Check system requirements are met
- Ensure your graphics drivers are up to date
- Try restarting your computer
- Check available disk space

**API connection issues**
- Verify API key is correct and active
- Check internet connection
- Ensure you have sufficient credits/tokens
- Try a different API provider

## Verification

To verify your installation is working correctly:

1. ✅ Application launches without errors
2. ✅ UI loads and displays properly
3. ✅ API keys can be configured and saved
4. ✅ Agents can be configured with different settings
5. ✅ Test conversation starts successfully
6. ✅ Messages can be sent and received
7. ✅ Conversations can be saved to disk

## Next Steps

After successful installation:

1. **Read the [Quick Start Guide](./QUICK_START.md)** for your first conversation
2. **Check the [FAQ](./FAQ.md)** for common questions
3. **Review [Documentation](./README.md)** for advanced features
4. **Join the Community** on GitHub Discussions

## Support

If you encounter installation issues not covered in this guide:

1. **Check existing issues** on [GitHub](https://github.com/spacewelder314/AgentCHAT/issues)
2. **Create a new issue** with details about your system and the error
3. **Include system information**:
   - Operating system and version
   - AgentCHAT version
   - Error messages (screenshots if possible)
   - Steps to reproduce the issue

---

**🎉 Congratulations!** You now have AgentCHAT installed and ready for multi-agent AI conversations.