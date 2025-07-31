# AgentCHAT Workflow Guide

## User Workflow

### Setting Up a Conversation

1. **Configure Agent 1** (left sidebar, top section)
   - Select AI provider from dropdown (14 options)
   - Pick a model (auto-fetched from provider, with fallback lists)
   - Write a persona/system prompt describing how Agent 1 should behave
   - Adjust temperature (0.0 focused, 2.0 creative), max tokens, top_p, top_k

2. **Configure Agent 2** (left sidebar, bottom section)
   - Same config options as Agent 1
   - Can use a completely different provider and model

3. **Set the System Prompt** (shared context both agents receive)
   - Default: "You are participating in a conversation between two AI agents..."

4. **Set the Initial Prompt** (the opening message that kicks things off)
   - This is delivered to Agent 1 as a "user" message to start the loop

5. **Set Max Turns** (how many back-and-forth exchanges before auto-stop)

### Running a Conversation

1. Click **Start** -- the conversation loop begins
2. Agent 1 responds to the initial prompt
3. Agent 2 responds to Agent 1's message
4. Agent 1 responds to Agent 2's message
5. Loop continues with a 2-second delay between turns
6. Stops when max turns reached or you click **Stop**

### Controls During Conversation

| Control | Action |
|---------|--------|
| **Pause** | Halts the loop after the current turn completes |
| **Resume** | Continues from where it paused |
| **Stop** | Ends the conversation, resets to idle |
| **Operator Inject** | Sends a hidden message to Agent 1 only (appears as `[OPERATOR MESSAGE]` in Agent 1's context) |

### Saving Results

- Click **Save** or press `Ctrl/Cmd+S`
- Native file dialog opens, default format is Markdown
- Exported file includes timestamps, agent names, and all messages

## Conversation Loop (Technical)

```
handleStartConversation()
  ├── Check API keys for both agents
  ├── Create system message + initial prompt message
  └── runConversationLoop(conversation, turn=0, maxTurns)
        ├── Determine responding agent (even turn = Agent 1, odd = Agent 2)
        ├── agentManager.getResponse(agent, messages)
        │   ├── Prepare messages: system prompt, last 10 context messages
        │   ├── Transform roles per agent perspective:
        │   │   - Own previous messages -> assistant role
        │   │   - Other agent's messages -> user role
        │   │   - Operator messages -> user role (Agent 1 only)
        │   ├── Fix role alternation for local providers (Ollama, Llama.cpp)
        │   └── apiClient.sendMessage() -> HTTP POST to provider
        ├── Add response to conversation state
        └── setTimeout(2000ms) -> runConversationLoop(turn+1)
```

### State Machine

```
IDLE --[Start]--> RUNNING --[Pause]--> PAUSED --[Resume]--> RUNNING
  ^                  |                                         |
  |                  |--[Stop]---> IDLE                        |
  |                  |--[Error]--> ERROR --[New]----------> IDLE
  |--[New]----------------------------------------------|
```

### Cancellation Safety

- Timeout ID stored in ref, cleared on unmount and stop/pause
- `isLoopRunningRef` prevents duplicate loops from rapid resume clicks
- State checked via ref (not stale closure) after every async API call

## Development Workflow

### Daily Development

```bash
npm run electron:dev     # Hot reload dev mode
```

This runs Vite (port 58743) and Electron concurrently. React changes hot-reload instantly. Main process changes require restart.

### Making Changes

1. **UI changes**: Edit components in `src/components/`
2. **New provider**: Add config to `src/services/APIClient.ts`, add enum to `src/types/index.ts`
3. **New IPC channel**: Add handler in `src/main.cjs`, expose in `src/preload.cjs`
4. **Styling**: Use Tailwind utilities, theme defined in `config/tailwind.config.js`

### Testing Changes

```bash
npm run lint              # ESLint (max 10 warnings allowed)
npm run build             # TypeScript + Vite (catches type errors)
npm run electron:preview  # Production build preview
```

### Release Build

```bash
./scripts/build-release-run.sh --platform linux    # Or mac, win, all
```

## Git Workflow

```bash
git checkout -b feature/your-feature
# make changes
npm run lint && npm run build    # verify
git add -A
git commit -m "feat: description"
git push origin feature/your-feature
# open PR on GitHub
```

Follow conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `chore:`

---

*See [DEVELOPMENT.md](DEVELOPMENT.md) for environment setup. See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.*
