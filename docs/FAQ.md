# Frequently Asked Questions

## General

### What is AgentCHAT?

AgentCHAT is a desktop application that lets two AI agents have conversations with each other. You configure each agent with a different AI provider, model, and persona, then watch them discuss a topic. You can also inject messages as an "operator" to steer the conversation in real-time.

### Is it free?

The app itself is free and open source (MIT license). You need API keys from AI providers, and some providers charge per use. OpenRouter offers free models (Llama 3.1 8B, Gemma 2 9B) that cost nothing.

### What platforms does it run on?

Windows 10+, macOS 10.15+, and Linux (glibc 2.17+). Available as DMG, PKG, EXE, MSI, AppImage, DEB, RPM, Snap, and portable builds.

## AI Providers

### Which AI providers are supported?

14 providers: OpenRouter, OpenAI, Anthropic, Google Gemini, DeepSeek, Groq, HuggingFace, Together AI, Mistral AI, xAI (Grok), Pi.ai, Meta (via Replicate), Ollama (local), and Llama.cpp (local).

### Can I use different providers for each agent?

Yes. That's the main feature. You can have Claude debate GPT-4, or Gemini talk to a local Llama model.

### Where do I get API keys?

- Anthropic: https://console.anthropic.com/
- OpenAI: https://platform.openai.com/
- Google: https://aistudio.google.com/app/apikey
- OpenRouter: https://openrouter.ai/keys
- Groq: https://console.groq.com/
- DeepSeek: https://platform.deepseek.com/
- Mistral: https://console.mistral.ai/
- Together: https://api.together.xyz/
- xAI: https://console.x.ai/

### How much does it cost per conversation?

Depends on the model. Free models (via OpenRouter) cost nothing. Claude 3 Haiku runs about $0.001-0.01 per conversation. GPT-4o runs about $0.05-0.20. Local models (Ollama, Llama.cpp) are free but require your own hardware.

### Does it work offline?

Only with local providers (Ollama or Llama.cpp). All cloud providers need an internet connection.

## Features

### Are my API keys secure?

Yes. Keys are encrypted at rest using `electron-store` with a per-installation encryption key generated on first launch. Keys are never logged or sent anywhere except the provider's own API endpoint.

### Can I export conversations?

Yes. Click the save button or press `Ctrl/Cmd+S` to export as a Markdown file.

### Can agents remember past conversations?

Not currently. Each conversation starts fresh. Persistent memory across sessions is on the roadmap.

### Can I add more than two agents?

The current version supports exactly two agents per conversation. Multi-agent support with more than two is planned for a future release.

### What is "operator injection"?

During a running conversation, you can type a message that gets injected as a system-level instruction visible only to Agent 1. This lets you steer the conversation without the other agent knowing.

### Why is the response slow?

Response time depends on the provider's server load, the model size, and your connection. Larger models (GPT-4, Claude Opus) are slower than smaller ones (GPT-4o mini, Haiku). Local models depend on your GPU.

## Technical

### What's the dev server port?

58743 (configured in package.json scripts).

### How do I run from source?

```bash
git clone https://github.com/sanchez314c/agent-chat.git
cd agent-chat
npm install
npm run electron:dev
```

### Linux: "credentials.cc: Permission denied"

```bash
sudo sysctl -w kernel.unprivileged_userns_clone=1
```

Or the app automatically adds `--no-sandbox` on Linux.

### macOS: "App is damaged"

```bash
xattr -cr /Applications/AgentCHAT.app
```

---

*See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more detailed debugging steps.*
