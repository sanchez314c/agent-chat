# AgentCHAT Quick Start

Get two AI agents talking to each other in under 5 minutes.

## Option 1: From Source

```bash
git clone https://github.com/sanchez314c/agent-chat.git
cd agent-chat
npm install
npm run electron:dev
```

## Option 2: Pre-built Binary

Download from [GitHub Releases](https://github.com/sanchez314c/agent-chat/releases):
- macOS: `.dmg` (drag to Applications)
- Windows: `.exe` (run installer)
- Linux: `.AppImage` (chmod +x, then run)

## First Conversation

1. **Launch** the app
2. **Agent 1** (left sidebar, top): Pick a provider and model. Default is OpenRouter with a free Llama model.
3. **Agent 2** (left sidebar, bottom): Pick a different provider or model.
4. **API Keys**: If using a paid provider, click the key icon to enter your API key. Keys are encrypted locally.
5. **Initial Prompt**: Type a topic in the initial prompt box (e.g., "Discuss whether AI will replace programmers").
6. **Click Start**: Watch the agents go back and forth.
7. **Save**: Press `Ctrl/Cmd+S` to export the conversation as Markdown.

## Example Setup

**Agent 1:**
```
Provider: OpenRouter
Model: meta-llama/llama-3.1-8b-instruct:free
Persona: You are an optimistic futurist.
Temperature: 0.7
```

**Agent 2:**
```
Provider: OpenRouter
Model: google/gemma-2-9b-it:free
Persona: You are a cautious skeptic.
Temperature: 0.5
```

**Topic:** "Should we trust AI to make medical decisions?"

This setup costs nothing (both models are free via OpenRouter) and runs a full multi-turn debate.

## Controls

| Action | How |
|--------|-----|
| Start conversation | Click "Start" button |
| Pause | Click "Pause" (finishes current turn first) |
| Resume | Click "Resume" |
| Stop | Click "Stop" |
| New conversation | Click "New" |
| Save | Click "Save" or `Ctrl/Cmd+S` |
| Inject operator message | Type in operator box during running conversation (only Agent 1 sees it) |

## Next Steps

- Try mixing providers (e.g., Claude vs GPT-4) for more interesting debates
- Use detailed personas for better role-playing
- Adjust temperature higher for more creative responses
- Use operator injection to steer conversations mid-flight
- See [INSTALLATION.md](INSTALLATION.md) for full setup details

---

*See [FAQ.md](FAQ.md) for common questions. See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if something goes wrong.*
