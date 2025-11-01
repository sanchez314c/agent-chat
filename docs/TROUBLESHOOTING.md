# Troubleshooting Guide

Comprehensive troubleshooting guide for common AgentCHAT issues and solutions.

## 🚨 Quick Diagnostics

Before diving into specific issues, run these quick checks:

### System Status Check
- **Internet Connection**: Verify you can access other websites
- **API Status**: Check if AI providers are experiencing outages
- **Application Version**: Ensure you're using the latest version
- **System Resources**: Check available memory and disk space

### Basic Troubleshooting Steps
1. **Restart the application** - resolves many temporary issues
2. **Check for updates** - ensure you have the latest version
3. **Verify API keys** - confirm they're valid and have credits
4. **Test different providers** - isolate provider-specific issues

## 🛠️ Installation Issues

### Application Won't Start

#### macOS Issues

**Issue**: "AgentCHAT can't be opened because Apple cannot check it for malicious software"

**Solution**:
1. Go to **System Preferences** → **Security & Privacy**
2. Click **"Open Anyway"** under "Allow apps downloaded from"
3. Try launching AgentCHAT again

**Issue**: "Application is damaged and can't be opened"

**Solution**:
```bash
# Remove quarantine attribute
xattr -d com.apple.quarantine /Applications/AgentCHAT.app
```

**Issue**: Application bounces in Dock then closes

**Solution**:
1. Check system requirements (macOS 10.15+)
2. Update to latest macOS version
3. Ensure sufficient disk space (500MB+)
4. Restart your Mac

#### Windows Issues

**Issue**: Windows Defender SmartScreen blocks the application

**Solution**:
1. Click **"More info"** in the SmartScreen dialog
2. Click **"Run anyway"**
3. This is normal for newly released applications

**Issue**: "The application failed to start properly"

**Solution**:
1. Install [Microsoft Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist)
2. Run Windows Update
3. Install as administrator:
   - Right-click the installer
   - Select "Run as administrator"

**Issue**: Application crashes immediately on startup

**Solution**:
1. Update graphics drivers
2. Disable antivirus temporarily
3. Run in compatibility mode:
   - Right-click AgentCHAT.exe
   - Properties → Compatibility
   - Try Windows 8 compatibility mode

#### Linux Issues

**Issue**: "Permission denied" when running AppImage

**Solution**:
```bash
chmod +x AgentCHAT-1.0.0.AppImage
./AgentCHAT-1.0.0.AppImage
```

**Issue**: Missing library dependencies

**Solution**:
```bash
# Ubuntu/Debian
sudo apt-get install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libuuid1 libsecret-1-0

# Fedora/CentOS
sudo dnf install gtk3 libnotify nss libXScrnSaver libXtst xdg-utils at-spi2-core libuuid libsecret

# Arch Linux
sudo pacman -S gtk3 libnotify nss libxss libxtst xdg-utils at-spi2-core libsecret
```

**Issue**: AppImage doesn't launch on Wayland

**Solution**:
```bash
# Run with XWayland
./AgentCHAT-1.0.0.AppImage --no-sandbox
```

## 🔑 API Key Issues

### API Connection Problems

**Issue**: "Invalid API Key" error

**Diagnosis**:
1. Check for typos in the API key
2. Verify the key is active and not expired
3. Ensure you selected the correct provider
4. Check if the key has sufficient credits

**Solution**:
1. Re-copy the API key from the provider's dashboard
2. Verify the provider dropdown matches your key type
3. Check your account balance/credits
4. Try generating a new API key

**Issue**: API requests timing out

**Diagnosis**:
1. Check internet connection stability
2. Verify API provider status
3. Test connection speed

**Solution**:
1. Test internet with other services
2. Check provider status pages:
   - [Anthropic Status](https://status.anthropic.com)
   - [OpenAI Status](https://status.openai.com)
   - [OpenRouter Status](https://openrouter.ai/status)
3. Try a different provider
4. Check firewall/VPN settings

**Issue**: Rate limiting errors

**Diagnosis**:
1. Sending too many requests too quickly
2. Exceeding provider rate limits
3. Multiple applications using same API key

**Solution**:
1. Slow down conversation pace
2. Increase delay between messages
3. Upgrade API plan for higher limits
4. Use separate API keys for different applications

### Provider-Specific Issues

#### OpenAI Issues

**Issue**: "Your access was terminated due to policy violations"

**Solution**:
1. Contact OpenAI support
2. Review OpenAI usage policies
3. Create a new account if necessary

**Issue**: Model not available

**Solution**:
1. Check if the model is deprecated
2. Verify your account has access to the model
3. Try alternative models (GPT-4 → GPT-3.5 Turbo)

#### Anthropic Issues

**Issue**: "Model overloaded, please try again"

**Solution**:
1. Wait a few minutes and retry
2. Try during off-peak hours
3. Use Claude 3 Haiku instead of Claude 3 Opus

#### OpenRouter Issues

**Issue**: Selected model unavailable

**Solution**:
1. Check OpenRouter model availability
2. Try a different model provider
3. Check your account balance

## 💬 Conversation Issues

### Agents Not Responding

**Issue**: Both agents silent after starting conversation

**Diagnosis**:
1. Check if both agents have valid API keys
2. Verify selected models are available
3. Check system console for error messages

**Solution**:
1. Verify both agents are configured correctly
2. Test each agent individually
3. Check developer console for errors (View → Developer Tools)
4. Restart the conversation

**Issue**: One agent responding, other silent

**Diagnosis**:
1. Silent agent has configuration issues
2. API key problem for silent agent
3. Model-specific issues

**Solution**:
1. Check silent agent's API key and provider
2. Swap providers between agents to isolate issue
3. Try different model for silent agent

### Conversation Quality Issues

**Issue**: Agents giving repetitive responses

**Solution**:
1. Increase temperature setting (0.5 → 0.7)
2. Improve system prompts
3. Add more context to conversation
4. Try different models

**Issue**: Responses too short or incomplete

**Solution**:
1. Increase max_tokens setting
2. Adjust temperature for more creative responses
3. Check if responses are being cut off by provider limits
4. Review provider-specific token limits

**Issue**: Conversation goes off-topic

**Solution**:
1. Refine system prompts with clearer instructions
2. Add conversation topic guidelines
3. Lower temperature for more focused responses
4. Intervene with guiding messages

## 🖥️ UI/UX Issues

### Display Problems

**Issue**: Text not rendering correctly

**Solution**:
1. Update graphics drivers
2. Try different display scaling settings
3. Reset application settings
4. Test on different display if available

**Issue**: Window sizing problems

**Solution**:
1. Reset application window size
2. Check display scaling settings
3. Try different resolution
4. Maximize and restore window

**Issue**: Dark/light theme not applying

**Solution**:
1. Restart application
2. Check system theme settings
3. Manual theme override in settings
4. Clear application cache

### Performance Issues

**Issue**: Application running slowly

**Diagnosis**:
1. High CPU/memory usage
2. Too many active conversations
3. Large conversation history
4. Network latency

**Solution**:
1. Close unused conversations
2. Reduce max_tokens for faster responses
3. Clear conversation history
4. Check system resources usage

**Issue**: Memory usage increasing over time

**Solution**:
1. Restart application periodically
2. Limit number of concurrent conversations
3. Clear old conversations
4. Check for memory leaks (report if found)

## 🔧 Development Issues

### Building from Source

**Issue**: npm install fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

**Issue**: TypeScript compilation errors

**Solution**:
1. Check Node.js version (16+ required)
2. Update TypeScript: `npm install typescript@latest`
3. Clear build cache: `npm run clean`
4. Check tsconfig.json configuration

**Issue**: Electron build fails

**Solution**:
1. Check Electron Builder configuration
2. Ensure all dependencies are installed
3. Verify build resources exist
4. Check platform-specific build requirements

### Development Server Issues

**Issue**: Development server not starting

**Solution**:
1. Check if port 5173 is available
2. Kill existing processes: `kill -9 $(lsof -ti:5173)`
3. Restart with: `npm run electron:dev`
4. Check firewall settings

**Issue**: Hot reload not working

**Solution**:
1. Check if file watchers are working
2. Verify Vite configuration
3. Check for file permission issues
4. Restart development server

## 🗂️ Data Issues

### Configuration Problems

**Issue**: Settings not saving

**Diagnosis**:
1. File permission issues
2. Corrupted configuration
3. Storage location problems

**Solution**:
1. Reset application settings
2. Check file permissions in app data directory
3. Clear corrupted configuration:
   ```bash
   # macOS
   rm ~/Library/Application\ Support/AgentCHAT/config.json

   # Windows
   del %APPDATA%\AgentCHAT\config.json

   # Linux
   rm ~/.config/AgentCHAT/config.json
   ```

### Conversation Issues

**Issue**: Unable to save conversations

**Solution**:
1. Check disk space availability
2. Verify write permissions in save location
3. Try saving to different location
4. Check filename for invalid characters

**Issue**: Unable to load saved conversations

**Solution**:
1. Verify file is not corrupted
2. Check file format is correct
3. Try loading a different conversation file
4. Check if file was saved by different version

## 📊 Getting Help

### Collecting Diagnostic Information

Before seeking help, gather this information:

1. **System Information**:
   - Operating system and version
   - AgentCHAT version
   - Available memory and disk space

2. **Error Details**:
   - Exact error messages
   - Steps to reproduce the issue
   - Screenshots if applicable

3. **Console Logs**:
   - Open Developer Tools (View → Toggle Developer Tools)
   - Check Console tab for errors
   - Copy relevant log entries

### Reporting Issues

1. **Check existing issues** on [GitHub Issues](https://github.com/spacewelder314/AgentCHAT/issues)
2. **Create detailed bug report** with:
   - Clear title describing the issue
   - System information
   - Step-by-step reproduction steps
   - Expected vs actual behavior
   - Error messages and logs
   - Screenshots if helpful

### Community Support

- **GitHub Discussions**: Ask questions and share experiences
- **Documentation**: Check [FAQ](./FAQ.md) and other guides
- **Discord/Community**: Join community discussions (if available)

---

**🔧 Still experiencing issues?** Don't hesitate to reach out for support. The AgentCHAT community is here to help you get the most out of your multi-agent AI conversation experience.