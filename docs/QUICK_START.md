# Quick Start Guide

Get AgentCHAT running in 5 minutes with this step-by-step guide.

## 🚀 Step 1: Download & Install

### Option A: Download Pre-built Application (Recommended)

1. **Download**: Go to the [Releases](https://github.com/spacewelder314/AgentCHAT/releases) page
2. **Choose your platform**:
   - **macOS**: Download `AgentCHAT-1.0.0-universal.dmg`
   - **Windows**: Download `AgentCHAT-Setup-1.0.0.exe`
   - **Linux**: Download `AgentCHAT-1.0.0.AppImage`
3. **Install**:
   - **macOS**: Open DMG, drag AgentCHAT to Applications
   - **Windows**: Run the installer and follow prompts
   - **Linux**: Make AppImage executable (`chmod +x AgentCHAT-1.0.0.AppImage`) and run

### Option B: Build from Source

```bash
git clone https://github.com/spacewelder314/AgentCHAT.git
cd AgentCHAT
npm install
npm run electron:dev
```

## 🔑 Step 2: Get API Keys

You need API keys for at least one AI provider to start.

### Quick Setup Options:

#### Option 1: OpenRouter (Easiest)
- **Website**: [openrouter.ai](https://openrouter.ai)
- **Benefits**: Access to 100+ models with one API key
- **Cost**: Pay-as-you-go, ~$1-5 per 1M tokens

#### Option 2: Anthropic Claude
- **Website**: [console.anthropic.com](https://console.anthropic.com)
- **Benefits**: High-quality reasoning, great conversations
- **Cost**: ~$3-15 per 1M tokens

#### Option 3: OpenAI GPT
- **Website**: [platform.openai.com](https://platform.openai.com)
- **Benefits**: Fast responses, popular choice
- **Cost**: ~$2-10 per 1M tokens

## ⚙️ Step 3: Configure Your First Agents

1. **Launch AgentCHAT**
2. **Click "Configure API Keys"** (top right)
3. **Add your API key**:
   - Select provider from dropdown
   - Enter your API key
   - Click "Save"
4. **Create your first agent**:
   - **Agent 1**:
     - Name: "Claude"
     - Provider: Anthropic
     - Model: Claude 3.5 Sonnet
     - Persona: "You are a helpful AI assistant. Be friendly and informative."
   - **Agent 2**:
     - Name: "GPT-4"
     - Provider: OpenAI
     - Model: GPT-4
     - Persona: "You are a creative AI. Think outside the box and suggest innovative ideas."

## 💬 Step 4: Start Your First Conversation

1. **Click "Start Conversation"**
2. **Watch the agents begin talking** to each other
3. **Join in anytime** by typing in the input field at the bottom
4. **Save your conversation** using File → Save Conversation (Cmd+S/Ctrl+S)

## 🎯 Example Conversation Starters

Try these initial prompts to get interesting conversations:

### Creative Brainstorming
- **User**: "Let's brainstorm ideas for a new mobile app that helps people reduce food waste."

### Technical Discussion
- **User**: "Discuss the pros and cons of microservices vs monolithic architecture."

### Philosophy & Ethics
- **User**: "What are the ethical implications of AI in creative industries?"

### Problem Solving
- **User**: "How would you solve the urban transportation crisis using technology?"

## 🔧 Quick Configuration Tips

### Agent Settings
- **Temperature** (0.0-1.0):
  - **0.2** = Factual, focused responses
  - **0.7** = Creative, diverse responses
  - **1.0** = Maximum creativity
- **Max Tokens**: 100-2000 (higher = longer responses)
- **System Prompt**: Defines the agent's personality and behavior

### Conversation Settings
- **Auto-save**: Automatically saves conversations
- **Theme**: Switch between dark/light modes
- **Timestamps**: Show when messages were sent

## 🆘 Common Quick Fixes

### "API Key Invalid"
- Double-check your API key for typos
- Ensure the key is active and has credits
- Verify you selected the correct provider

### "Agents Not Responding"
- Check your internet connection
- Try different models (some may be unavailable)
- Lower max tokens if responses are too long

### "Application Won't Start"
- **macOS**: If you see a security warning, go to System Preferences → Security & Privacy → "Allow Anyway"
- **Windows**: Try running as administrator
- **Linux**: Install with `chmod +x` for AppImage

## 📚 Next Steps

Now that you're up and running, explore:

1. **[Full Documentation](./README.md)** - Complete feature overview
2. **[API Providers](./TECHSTACK.md)** - All supported AI providers
3. **[Development Guide](./DEVELOPMENT.md)** - Build from source
4. **[FAQ](./FAQ.md)** - Common questions and issues

## 💡 Pro Tips

- **Use OpenRouter** to access many models with one key
- **Different models** = different conversation styles
- **Save interesting conversations** for later reference
- **Experiment with personas** to create unique agent personalities
- **Local models** work well with Ollama for offline use

---

**🎉 Congratulations!** You now have AgentCHAT running and can start exploring multi-agent AI conversations.

Need help? Check our [FAQ](./FAQ.md) or open an issue on [GitHub](https://github.com/spacewelder314/AgentCHAT/issues).