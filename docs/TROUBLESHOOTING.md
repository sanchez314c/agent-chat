# AgentCHAT Troubleshooting

## Common Issues

### Application Won't Start

**Symptom:** App crashes on launch or shows blank window

**Solutions:**

1. **Linux Sandbox Error**
   ```bash
   sudo sysctl -w kernel.unprivileged_userns_clone=1
   ```
   Or add `--no-sandbox` to launch command.

2. **Clear App Data**
   - macOS: `~/Library/Application Support/AgentCHAT`
   - Windows: `%APPDATA%/AgentCHAT`
   - Linux: `~/.config/AgentCHAT`

3. **Reinstall Dependencies (from source)**
   ```bash
   rm -rf node_modules
   npm install
   ```

### API Connection Errors

**Symptom:** "API Error" or no response from agents

**Solutions:**

1. **Verify API Key**
   - Check key is entered correctly
   - Ensure key has proper permissions
   - Verify account has credits/quota

2. **Check Network**
   - Test internet connection
   - Check firewall/proxy settings
   - Try different network

3. **Provider Status**
   - Check provider status page
   - Anthropic: status.anthropic.com
   - OpenAI: status.openai.com

### Blank/White Screen

**Symptom:** Window opens but content is blank

**Solutions:**

1. **DevTools Check**
   - Press `Ctrl+Shift+I` to open DevTools
   - Check Console for errors

2. **GPU Acceleration**
   - Try disabling hardware acceleration
   - Add `--disable-gpu` flag

3. **Rebuild**
   ```bash
   npm run build
   npm run electron:preview
   ```

### High Memory Usage

**Symptom:** App uses excessive RAM

**Solutions:**

1. **Restart App** - Clears accumulated state
2. **Reduce Context** - Lower max tokens setting
3. **Close DevTools** - Uses significant memory

### Messages Not Appearing

**Symptom:** Agents respond but messages don't show

**Solutions:**

1. **Scroll Down** - Messages may be below view
2. **Check Console** - Look for render errors
3. **Clear Conversation** - Start fresh

## Platform-Specific Issues

### macOS

**"App is damaged and can't be opened"**
```bash
xattr -cr /Applications/AgentCHAT.app
```

**Notarization Warning**
- Right-click app → Open
- Click "Open" in dialog

### Windows

**Missing VCRUNTIME**
- Install [Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe)

**SmartScreen Block**
- Click "More info"
- Click "Run anyway"

### Linux

**AppImage Won't Execute**
```bash
chmod +x AgentCHAT-*.AppImage
```

**Missing Libraries**
```bash
# Debian/Ubuntu
sudo apt install libgtk-3-0 libnotify4 libnss3 libxss1

# Fedora
sudo dnf install gtk3 libnotify nss libXScrnSaver
```

## Development Issues

### Build Fails

```bash
# Clean build
rm -rf dist/ release/ node_modules/
npm cache clean --force
npm install
npm run build
```

### Hot Reload Not Working

1. Check Vite server is running (port 58743)
2. Restart `npm run electron:dev`
3. Clear Vite cache: `rm -rf node_modules/.vite`

### TypeScript Errors

```bash
# Check types
npx tsc --noEmit

# Fix lint issues
npm run lint
```

## Getting Help

1. **Check existing issues**: [GitHub Issues](https://github.com/sanchez314c/AgentCHAT/issues)
2. **Create new issue** with:
   - OS and version
   - App version
   - Steps to reproduce
   - Error messages/logs

---

## Frequently Asked Questions

### What is AgentCHAT?

AgentCHAT is a desktop application that enables conversations between two AI agents. You configure each agent with a different AI provider and persona, then watch them discuss a topic autonomously while you can inject messages to steer the conversation.

### Is it free?

AgentCHAT itself is free and open source. You need API keys from AI providers, which may have usage costs depending on the provider and model.

### Which AI providers are supported?

14 providers are supported:
- **Anthropic** — Claude 3.5 Sonnet, Claude Opus 4, and more
- **OpenAI** — GPT-4, GPT-4o, GPT-3.5 Turbo, and more
- **Google Gemini** — Gemini 2.5 Pro, 2.0 Flash, 1.5 Pro, Gemma variants
- **OpenRouter** — Access to Llama, Mixtral, and hundreds of other models
- **DeepSeek** — deepseek-chat, deepseek-coder
- **Groq** — llama3, mixtral (fast inference)
- **HuggingFace** — Llama 2, Mistral, and other open models
- **Together AI** — Llama 3, Mixtral, and others
- **Mistral AI** — mistral-small, mistral-large
- **xAI (Grok)** — grok-1, grok-2
- **Pi.ai** — pi
- **Ollama** — Local models (llama3.2, mistral, phi3, etc.)
- **Llama.cpp** — Local server (any GGUF model)
- **Meta (via Replicate)** — llama-2-70b-chat and others

### Can I use different providers for each agent?

Yes — that's one of the main features. You can have Claude debate GPT-4, or Gemini talk to a local Llama model.

### How much does it cost to use?

Costs depend on the provider and model. Using OpenRouter's free models (Llama 3.1 8B, Gemma 2 9B) costs nothing. Paid models: Claude 3 Haiku ~$0.001-0.01 per conversation, GPT-4o ~$0.05-0.20.

### Are my API keys secure?

Yes. Keys are encrypted via `electron-store` with a per-installation encryption key. They are never logged or transmitted except directly to the respective AI provider.

### Can I export conversations?

Yes. Click the save button or use `Ctrl/Cmd+S` to export the current conversation as a Markdown file.

### Can agents have memory of past conversations?

Not currently. Each conversation starts fresh. Persistent memory is on the roadmap.

### Can I add more than two agents?

The current version supports exactly two agents. Multi-agent support is planned.

### Does it work offline?

Only if you use a local provider (Ollama or Llama.cpp). Cloud providers (Anthropic, OpenAI, etc.) require internet access.

### Why is the response slow?

Response time depends on the provider's server load, model size, and your internet connection. GPT-4 and Claude Opus are slower than smaller models like Haiku or GPT-4o mini.

### Where do I get API keys?

- Anthropic: https://console.anthropic.com/
- OpenAI: https://platform.openai.com/
- Google: https://aistudio.google.com/app/apikey
- OpenRouter: https://openrouter.ai/keys
- Groq: https://console.groq.com/
