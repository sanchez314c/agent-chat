# Frequently Asked Questions (FAQ)

## General Questions

### What is AgentCHAT?
AgentCHAT is a multi-agent AI conversation desktop application that enables you to have conversations between different AI agents. You can configure multiple AI agents with different personalities, providers (Claude, GPT-4, Gemini, etc.), and watch them interact with each other.

### What platforms does AgentCHAT support?
AgentCHAT supports:
- **macOS** (Intel, Apple Silicon, Universal)
- **Windows** (x64, x86, ARM64)
- **Linux** (x64, ARM64, ARMv7l)

### Is AgentCHAT free?
Yes, AgentCHAT is open source and free to use. However, you'll need to provide your own API keys for the AI services you want to use.

## Installation & Setup

### How do I install AgentCHAT?
1. Download the appropriate version for your platform from the [Releases](https://github.com/spacewelder314/AgentCHAT/releases) page
2. Install the application following your platform's standard procedure
3. Launch the application and configure your API keys

### What are the system requirements?
- **Operating System**: macOS 10.15+, Windows 10+, or modern Linux distributions
- **Memory**: 4GB RAM minimum (8GB recommended)
- **Storage**: 500MB available space
- **Network**: Internet connection for AI provider APIs

### Do I need to install Node.js?
No, the distributed applications include everything needed to run. You only need Node.js if you want to develop or build from source.

## AI Providers & API Keys

### Which AI providers are supported?
AgentCHAT supports 15+ AI providers:
- **Major**: Anthropic Claude, OpenAI GPT, Google Gemini
- **Open Source**: Llama, Mixtral, Gemma, Mistral (via OpenRouter)
- **Local**: Ollama, LM Studio, LlamaCPP
- **Specialized**: DeepSeek, Groq, HuggingFace, Meta, Pi, Together, xAI

### How do I get API keys?
Each provider has different sign-up processes:
- **Anthropic Claude**: [console.anthropic.com](https://console.anthropic.com)
- **OpenAI**: [platform.openai.com](https://platform.openai.com)
- **Google Gemini**: [makersuite.google.com](https://makersuite.google.com)
- **OpenRouter**: [openrouter.ai](https://openrouter.ai)
- Others: Check their respective websites

### Are my API keys secure?
Yes. AgentCHAT uses per-installation encryption to secure your API keys. They are encrypted on your device and never transmitted to our servers.

### Can I use local AI models?
Yes! AgentCHAT supports local models through:
- **Ollama**: Run `ollama serve` and configure in AgentCHAT
- **LM Studio**: Start the local server and use the provided endpoint
- **LlamaCPP**: Configure your local server endpoint

## Usage

### How do I start a conversation?
1. Configure at least two agents with different API keys
2. Set their personalities and parameters
3. Click "Start Conversation" to begin
4. The agents will begin conversing automatically

### Can I participate in conversations?
Yes! You can inject messages into the conversation at any time using the input field.

### How do I save conversations?
Click "Save Conversation" in the menu or use the keyboard shortcut (Cmd+S on Mac, Ctrl+S on Windows/Linux).

### Can I customize agent behavior?
Yes! Each agent can be configured with:
- Provider and model selection
- System persona/personality
- Temperature (creativity)
- Max tokens (response length)
- Advanced parameters (top_p, top_k, etc.)

## Troubleshooting

### Application won't start
- **macOS**: Check System Preferences → Security & Privacy if you get a security warning
- **Windows**: Run as administrator if you encounter permission issues
- **Linux**: Ensure you have the required dependencies installed

### API connection issues
- Verify your API key is correct and active
- Check your internet connection
- Ensure you have sufficient credits/tokens with the provider
- Try a different provider to isolate the issue

### Agents not responding
- Check that both agents are properly configured with valid API keys
- Verify the selected models are available and working
- Check the console for error messages (View → Toggle Developer Tools)

### Performance issues
- Reduce the number of active conversations
- Lower the max tokens setting for faster responses
- Use lighter models for faster performance
- Check your internet connection speed

## Development

### How do I build from source?
```bash
git clone https://github.com/spacewelder314/AgentCHAT.git
cd AgentCHAT
npm install
npm run electron:dev
```

### How do I contribute?
Please see [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

### What technologies are used?
- **Frontend**: React 18 with TypeScript
- **Desktop**: Electron 39
- **Build**: Vite with Electron Builder
- **Styling**: Tailwind CSS
- **Development**: ESLint, TypeScript strict mode

## Privacy & Security

### Are my conversations private?
Yes. Conversations are stored locally on your device and are not transmitted to any servers other than the AI providers you're using.

### What data is collected?
AgentCHAT does not collect any personal data. The only data transmitted are your API requests to the AI providers you configure.

### Is the application open source?
Yes, AgentCHAT is fully open source. You can view the source code on [GitHub](https://github.com/spacewelder314/AgentCHAT).

## Support

### How do I get help?
- **Issues**: Report bugs on [GitHub Issues](https://github.com/spacewelder314/AgentCHAT/issues)
- **Feature Requests**: Submit on [GitHub Issues](https://github.com/spacewelder314/AgentCHAT/issues)
- **Documentation**: Check the [docs/](./) folder for detailed guides

### Where can I request new features?
Please use the [Feature Request](https://github.com/spacewelder314/AgentCHAT/issues/new?template=feature_request.md) template on GitHub.

---

Still have questions? Please check the [documentation](./) or open an issue on GitHub.