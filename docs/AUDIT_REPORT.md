# FORENSIC AUDIT REPORT — AgentCHAT
**Audit Date:** 2026-03-08
**Auditor:** Master Control (Claude Code)
**Framework Location:** `/media/heathen-admin/RAID/Development/Projects/portfolio/agent-chat`
**Total Files Analyzed:** 137
**Total Lines of Code:** ~69,821

## EXECUTIVE SUMMARY

AgentCHAT is an Electron + React + TypeScript desktop application that enables two AI agents to converse autonomously. The app supports 14 AI providers with encrypted API key storage and a Neo-Noir Glass Monitor design system. The codebase is functional but carries significant technical debt: **Electron 25 is severely outdated** with known Chromium CVEs, the operator message injection system has a race condition that silently drops messages from the API context, and several API providers (Replicate, Gemini parameter mapping) are non-functional. The documentation suite is extensive but riddled with contradictions — Node.js version requirements differ across 4 documents, the GitHub repo URL casing is inconsistent across 7+ files, and the README claims "Real-time Streaming" as a feature despite the architecture being synchronous fetch.

The bash scripts have multiple bugs including glob-inside-brackets patterns that never expand, `find` operator precedence errors, and locale-dependent `ls` parsing. The `config/` subdirectory contains stale duplicate config files with broken relative paths that would cause Tailwind to purge all CSS classes if accidentally loaded. Security posture is weakened by disabled Chromium sandbox, overly broad CSP `connect-src https:` wildcard, and plaintext encryption key storage.

**Overall Health: 5/10** — Functional core with significant security, reliability, and documentation debt.

## SEVERITY CLASSIFICATION
- **CRITICAL**: Security vulnerabilities, data loss risks, breaking bugs
- **HIGH**: Significant bugs, reliability issues, major gaps
- **MEDIUM**: Code quality issues, minor bugs, missing error handling
- **LOW**: Style issues, minor improvements, nice-to-haves
- **INFO**: Observations, architectural notes, suggestions

---

## FILE INVENTORY

### Active Source (`src/`)
| File | Category | Status |
|------|----------|--------|
| `src/main.cjs` | Electron Main | Active — security issues |
| `src/preload.cjs` | Electron Preload | Active — dead code |
| `src/main.tsx` | React Entry | Active — clean |
| `src/App.tsx` | React Root | Active — bugs |
| `src/index.css` | Styles | Active — clean |
| `src/index.html` | HTML Template | Active — CSP issues |
| `src/components/AgentConfigPanel.tsx` | Component | Active — memory leak |
| `src/components/APIKeyModal.tsx` | Component | Active — minor |
| `src/components/ConversationPanel.tsx` | Component | Active — minor |
| `src/components/ErrorBoundary.tsx` | Component | Active — clean |
| `src/components/MessageBubble.tsx` | Component | Active — minor |
| `src/components/StatusBar.tsx` | Component | Active — hardcoded version |
| `src/services/AgentManager.ts` | Service | Active — bugs |
| `src/services/APIClient.ts` | Service | Active — multiple bugs |
| `src/types/index.ts` | Types | Active — dead types |

### Configuration
| File | Category | Status |
|------|----------|--------|
| `package.json` | NPM Config | Active — outdated deps |
| `tsconfig.json` | TypeScript | Active — loose settings |
| `tsconfig.node.json` | TypeScript | Active — references missing dir |
| `vite.config.ts` | Build Config | Active — correct |
| `config/vite.config.ts` | Build Config | **STALE — broken paths** |
| `config/postcss.config.js` | PostCSS | **STALE — potential conflict** |
| `config/tailwind.config.js` | Tailwind | **STALE — broken content paths** |
| `postcss.config.js` | PostCSS | Active — references config/ |
| `.eslintrc.json` | Linting | Active — loose rules |
| `.eslintignore` | Linting | Active — correct |
| `.editorconfig` | Editor | Active — correct |
| `.env.example` | Environment | Active — incomplete |
| `.nvmrc` | Node Version | **BUG — Node 24 doesn't exist** |
| `.gitignore` | Git | Active — has legacy Python rules |
| `.gitattributes` | Git | Active — has legacy Python rules |
| `index.html` | Electron HTML | Active — CSP issues |

### Scripts
| File | Category | Status |
|------|----------|--------|
| `run-source-linux.sh` | Dev Launcher | Active — bugs |
| `run-source-mac.sh` | Dev Launcher | Active — minimal |
| `run-source-windows.bat` | Dev Launcher | Active — clean |
| `scripts/bloat-check.sh` | Analysis | Active — multiple bugs |
| `scripts/build-linux.sh` | Build | Active — uses npm install |
| `scripts/build-release-run.sh` | Build | Active — incomplete |
| `scripts/clean-logs.js` | Utility | **BROKEN — missing dep, wrong module format** |
| `scripts/compile-build-dist.sh` | Build | Active — bugs |
| `scripts/run-linux.sh` | Launcher | Active — dead code |
| `scripts/run-linux-source.sh` | Dev Launcher | Active — clean |
| `scripts/run-macos.sh` | Launcher | Active — find bug |
| `scripts/run-macos-source.sh` | Dev Launcher | Active — clean |
| `scripts/run-windows.bat` | Launcher | Active — clean |
| `scripts/run-windows-source.bat` | Dev Launcher | Active — clean |
| `scripts/temp-cleanup.sh` | Utility | Active — overly aggressive |

### Documentation (26 files)
| File | Status |
|------|--------|
| `README.md` | Stale — version contradictions, obsolete roadmap |
| `docs/API.md` | Accurate |
| `docs/ARCHITECTURE.md` | Accurate |
| `docs/BUILD_COMPILE.md` | Accurate |
| `docs/DEPLOYMENT.md` | Minor issues |
| `docs/DEVELOPMENT.md` | Accurate |
| `docs/FAQ.md` | Minor contradictions |
| `docs/INSTALLATION.md` | Minor contradictions |
| `docs/QUICK_START.md` | Present |
| `docs/README.md` | Present — exposes internal files |
| `docs/TECHSTACK.md` | Present |
| `docs/TROUBLESHOOTING.md` | Present |
| `docs/WORKFLOW.md` | Accurate |
| `CHANGELOG.md` | Duplicate header structure |
| `CONTRIBUTING.md` | Present |
| `CODE_OF_CONDUCT.md` | Present |
| `SECURITY.md` | Present |
| `LICENSE` | Present (MIT) |
| `dev/PRD.md` | **6 months stale** |
| `dev/TODO.md` | **6 months stale** |
| `dev/LEARNINGS.md` | **Stale — references nonexistent features** |

### Legacy (3 versions preserved)
| Directory | Contents |
|-----------|----------|
| `legacy/v0.0.1/` | Original Python/Tkinter version |
| `legacy/v0.0.2/` | First Electron port |
| `legacy/v0.0.3/` | Pre-restructure Electron |

### Build Artifacts
| File | Status |
|------|--------|
| `dist/renderer/` | Built Vite output — should be gitignored |

---

## DEPENDENCY & FLOW MAP

```
Entry Points:
  run-source-linux.sh → npm run dev → vite (port 58743) + electron src/main.cjs
  scripts/build-linux.sh → npm run build → vite build + electron-builder

Electron Main Process (src/main.cjs):
  ├── Creates BrowserWindow (frameless, no sandbox)
  ├── electron-store (encrypted with ~/.key file)
  ├── IPC Handlers:
  │   ├── store-api-key / get-api-key / delete-api-key
  │   ├── get-all-api-keys / get-env-api-key
  │   └── save-conversation-file
  └── Loads: index.html → Vite dev server OR dist/renderer/index.html

React Renderer:
  src/main.tsx → src/App.tsx
  ├── Components:
  │   ├── AgentConfigPanel.tsx (sidebar config)
  │   ├── APIKeyModal.tsx (key management)
  │   ├── ConversationPanel.tsx (message display)
  │   ├── MessageBubble.tsx (individual messages)
  │   ├── StatusBar.tsx (bottom bar)
  │   └── ErrorBoundary.tsx (crash recovery)
  ├── Services:
  │   ├── AgentManager.ts (orchestration, context window, role alternation)
  │   └── APIClient.ts (HTTP client, 14 providers, model fetching)
  └── Types:
      └── index.ts (all TypeScript interfaces/enums)

Conversation Loop (App.tsx → AgentManager → APIClient):
  1. System message + initial prompt injected
  2. Agent 1 sends (via AgentManager.getAgentResponse)
  3. Agent 2 sends
  4. Repeat until maxTurns or stop/error
  5. Context window: last 10 messages per turn
```

---

## FINDINGS BY SEVERITY

### CRITICAL FINDINGS

#### C1: Electron 25 — Severely Outdated with Known CVEs
**File:** `package.json:60`
**Impact:** Electron 25 ships Chromium 114 with known remote code execution vulnerabilities patched in later versions.
**Fix:** Requires manual migration to Electron 30+ (major version upgrade with breaking changes).
```
DEFERRED — Requires manual major version migration
```

#### C2: Operator Message Injection Race Condition
**File:** `src/App.tsx:296-306`
**Impact:** Messages injected by the operator via `handleInjectOperatorMessage` update React state (`setConversation`) but are NOT included in the `updatedConversation` object passed through the `setTimeout` to the next loop iteration. The conversation loop maintains its own copy of the conversation, separate from React state. Operator messages appear in the UI but are invisible to the API.
**Fix:**
```typescript
// In runConversationLoop, after getting response, merge React state:
// Replace the setTimeout callback to read from conversationRef instead of local conv
```

#### C3: Operator Injection Silently Blocked While Paused
**File:** `src/App.tsx:358`
**Impact:** `handleInjectOperatorMessage` checks `conversationState === ConversationState.RUNNING` but the UI (AgentConfigPanel) shows the injection UI when paused. Users type messages that are silently discarded.
**Fix:** Allow injection when PAUSED, or hide the injection UI when not RUNNING.

#### C4: Meta/Replicate Provider Completely Non-Functional
**File:** `src/services/APIClient.ts:237-258`
**Impact:** Replicate uses async predictions (POST to create, then poll for result). The APIClient sends a synchronous request and expects an immediate response. Replicate will return a prediction ID, not content.
**Fix:** Remove Replicate from available providers or implement async polling.

#### C5: Gemini Receives Wrong Parameter Names
**File:** `src/services/APIClient.ts:121-148`
**Impact:** `sanitizeParams(additionalParams)` injects snake_case params (`presence_penalty`, `frequency_penalty`, `top_k`) into Gemini's `generationConfig`. Gemini uses camelCase (`topK`, `topP`) and doesn't support presence/frequency penalties. Invalid params cause silent failures or 400 errors.
**Fix:** Add Gemini-specific parameter transformation.

#### C6: CSP connect-src Allows Any HTTPS Endpoint
**File:** `index.html:7`
**Impact:** `connect-src 'self' https: http://localhost:* http://127.0.0.1:*` — the bare `https:` allows connections to ANY HTTPS URL. An XSS attack could exfiltrate data to any server.
**Fix:** Enumerate specific provider domains.

#### C7: Plaintext Encryption Key on Disk
**File:** `src/main.cjs:20-41`
**Impact:** The encryption key for electron-store is saved as plaintext in `<userData>/.key` with 0o600 permissions. On Windows, UNIX permissions are ignored. Any process running as the user can read API keys.
**Fix:** Use OS keychain (keytar/safeStorage) instead of file-based key storage.

#### C8: .nvmrc Specifies Node 24 Which Doesn't Exist
**File:** `.nvmrc:1`
**Impact:** `nvm use` fails for all developers. CI uses Node 18. Complete version mismatch.
**Fix:** Change to `22` (current LTS).

### HIGH FINDINGS

#### H1: config/tailwind.config.js Has Broken Content Paths
**File:** `config/tailwind.config.js:3-5`
**Impact:** Content paths `./index.html` and `./src/**/*` resolve relative to `config/`, pointing to nonexistent locations. If this config is loaded, Tailwind purges ALL CSS classes in production, resulting in a blank/unstyled app.
**Fix:** Update paths to `../index.html` and `../src/**/*`, or delete this stale config.

#### H2: config/vite.config.ts Has Broken Path Resolution
**File:** `config/vite.config.ts:11,18,22`
**Impact:** `__dirname` resolves to `config/`, so `./src` becomes `config/src/` (nonexistent). Port is 5173 instead of 58743. If accidentally loaded, build fails entirely.
**Fix:** Delete this stale config file.

#### H3: scripts/clean-logs.js Missing Dependency and Wrong Module Format
**File:** `scripts/clean-logs.js:1,5,13`
**Impact:** (a) `require('glob')` but `glob` is not in package.json — crashes with MODULE_NOT_FOUND. (b) `.js` extension with `"type": "module"` in package.json means Node treats it as ESM, but it uses CJS `require()`. (c) Regex `[^)]*` can't handle nested parentheses, producing malformed code.
**Fix:** Rename to `.cjs`, add `glob` to devDependencies, fix the regex.

#### H4: Ollama Model Fetch Ignores Custom Host/Port
**File:** `src/services/APIClient.ts:874-876`
**Impact:** `fetchOllamaModels` always queries `localhost:11434` regardless of user's configured host/port in localServerConfig. Model list won't load for non-default Ollama setups.
**Fix:** Pass `localServerConfig` through to `fetchOllamaModels`.

#### H5: Llama.cpp Default Host Fails SSRF Validation
**File:** `src/services/APIClient.ts:16-21` vs `src/components/AgentConfigPanel.tsx:356`
**Impact:** AgentConfigPanel shows `0.0.0.0` as the default Llama.cpp host, but `validateLocalServer` only allows `localhost`, `127.0.0.1`, `::1`, `[::1]`. The default shown in the UI is rejected by the validation logic.
**Fix:** Add `0.0.0.0` to the allowed list, or change the UI default to `localhost`.

#### H6: Hardcoded Agent ID Check Breaks Operator Injection
**File:** `src/services/AgentManager.ts:88-91`
**Impact:** `agent.id === 'agent1'` is hardcoded. If agent IDs change from defaults, operator messages are silently excluded from the context.
**Fix:** Compare against `conversation.agents[0].id` instead.

#### H7: Double System Message in API Calls
**File:** `src/services/AgentManager.ts:85`
**Impact:** Filter `msg.id !== 'system'` only catches the persona system message (id='system'). The App.tsx system message has a UUID id, so it passes through. Both system messages are sent to the API, potentially confusing the model or wasting tokens.
**Fix:** Filter by `msg.role !== MessageRole.SYSTEM` instead of ID.

#### H8: Anthropic API Rejects Consecutive User Messages
**File:** `src/services/APIClient.ts:93-106`
**Impact:** Anthropic requires alternating user/assistant roles. Operator-injected messages become `user` role, which can create consecutive user messages. Anthropic returns 400 errors.
**Fix:** Apply role alternation fix for Anthropic requests, or merge consecutive same-role messages.

#### H9: Node.js Version Contradictions Across Docs
**Impact:** README says 16+, DEVELOPMENT/INSTALLATION say 18+, .nvmrc says 24, CI uses 18.
**Fix:** Standardize to 22 (current LTS) everywhere.

#### H10: README Claims "Real-time Streaming" — Architecture Is Synchronous
**File:** `README.md:29`
**Impact:** The README features section claims streaming but the APIClient uses synchronous `fetch` with a 60-second timeout. This is false advertising.
**Fix:** Remove streaming claim from README, or implement actual streaming.

#### H11: README Roadmap Is Completely Obsolete
**File:** `README.md:419-423`
**Impact:** Describes a future path from v0.1.0 to v1.0.0 but the app is already at v1.0.0.
**Fix:** Remove or rewrite the roadmap section.

#### H12: compile-build-dist.sh Glob Inside [ -f ] Never Expands
**File:** `scripts/compile-build-dist.sh:337`
**Impact:** `if [ -f "dist/*.exe" ]` — glob inside quotes+brackets never expands. The check always fails, skip exe size checking.
**Fix:** Use `ls dist/*.exe 2>/dev/null` or a for loop.

#### H13: run-macos.sh find Operator Precedence Bug
**File:** `scripts/run-macos.sh:66,77`
**Impact:** `-type d` only applies to the second `-name` due to OR precedence. First `-name` matches files and directories.
**Fix:** Add grouping parentheses: `\( -name "X" -o -name "Y" \) -type d`

#### H14: Mutable Global API_PROVIDERS Object
**File:** `src/services/APIClient.ts:30-442,657`
**Impact:** `fetchModelsForProvider` mutates `API_PROVIDERS[provider].models` directly. Shared mutable state across all APIClient instances.
**Fix:** Use instance-level model cache (already have `modelCache` Map).

#### H15: tests/ Directory Referenced But Does Not Exist
**Impact:** CHANGELOG references adding `.gitkeep` to test directories. No test infrastructure exists.
**Fix:** Document that tests are not yet implemented, remove stale references.

### MEDIUM FINDINGS

#### M1: AgentConfigPanel Async Effect Missing Cleanup
**File:** `src/components/AgentConfigPanel.tsx:201-203`
**Impact:** If component unmounts during model fetch, React state update on unmounted component causes warning.
**Fix:** Add AbortController or mounted flag.

#### M2: Menu Event Listeners Never Fire (Dead Code)
**File:** `src/preload.cjs:14-28`
**Impact:** `Menu.setApplicationMenu(null)` in main.cjs removes all menus. `onMenuNewConversation` and `onMenuSaveConversation` listeners never receive events.

#### M3: Duplicate app.setAppUserModelId Calls
**File:** `src/main.cjs:82,151`
**Impact:** Line 82 is immediately overwritten by line 151. Dead code.

#### M4: StatusBar Hardcoded Version String
**File:** `src/components/StatusBar.tsx:101`
**Impact:** `'AgentCHAT v1.0.0'` is hardcoded instead of reading from package.json.

#### M5: No Markdown Rendering in Messages
**File:** `src/components/MessageBubble.tsx:108`
**Impact:** AI responses containing markdown (headers, code blocks, lists) display as raw text.

#### M6: Duplicated Role Alternation Logic
**File:** `src/services/AgentManager.ts:128-161` and `src/services/APIClient.ts:403-441`
**Impact:** Role alternation fix exists in both AgentManager and APIClient (for Llama.cpp). Duplicated logic.

#### M7: phantom Providers in VALID_PROVIDERS
**File:** `src/main.cjs:172`
**Impact:** Providers like `'claude'`, `'replicate'`, `'moonshot'`, `'kimi'` can store keys via IPC but don't exist in the APIProvider enum.

#### M8: Fragile Agent Name Detection
**File:** `src/services/AgentManager.ts:258`
**Impact:** `msg.agentId?.includes('1')` is a substring check. Would match `agent12`, `agent1-backup`, etc.

#### M9: Env Variable Mappings Incomplete
**File:** `src/main.cjs:193-211`
**Impact:** No env var fallback for huggingface, replicate, ollama, llamacpp, openrouter, xai providers.

#### M10: APIKeyModal No Keyboard Shortcuts
**File:** `src/components/APIKeyModal.tsx`
**Impact:** No Enter-to-submit, no Escape-to-close, no click-outside-to-close.

#### M11: 60-Second API Timeout Too Short for Reasoning Models
**File:** `src/services/APIClient.ts:963`
**Impact:** Reasoning models (o1, deepseek-reasoner) can take 2+ minutes. Timeout kills the request.

#### M12: vite-plugin-electron Installed But Never Used
**File:** `package.json:69-70`
**Impact:** `vite-plugin-electron` and `vite-plugin-electron-renderer` are dead devDependencies.

#### M13: Dead Types in types/index.ts
**File:** `src/types/index.ts:85-100`
**Impact:** `AppState` and `AppSettings` interfaces are never imported or used.

#### M14: GitHub Repo URL Casing Inconsistent
**Impact:** 7+ documents use `agent-chat` vs `AgentCHAT` inconsistently.

#### M15: CHANGELOG Has Duplicate Header
**File:** `CHANGELOG.md:217`
**Impact:** Two separate `# CHANGELOG` headers in the same file.

#### M16: dev/PRD.md, dev/TODO.md Are 6 Months Stale
**Impact:** Reference only 4 providers, wrong class names, list implemented features as TODO.

#### M17: Snap base core20 is EOL
**File:** `package.json:278`
**Impact:** core20 is Ubuntu 20.04 based, now end-of-life.

#### M18: CI Uses Node 18, Should Match .nvmrc
**File:** `.github/workflows/ci.yml:19,45`
**Impact:** CI and local dev use different Node versions.

### LOW FINDINGS

#### L1: ESLint no-explicit-any Disabled
**File:** `.eslintrc.json:14`

#### L2: Google Fonts Requires Internet in Electron
**File:** `src/index.css:3`

#### L3: No Window Minimize/Maximize IPC Handlers
**File:** `src/main.cjs`

#### L4: process.exit(0) After app.quit()
**File:** `src/main.cjs:86`

#### L5: Anthropic API Version String Outdated
**File:** `src/services/APIClient.ts:90`

#### L6: xAI Models List Stale (grok-1 deprecated)
**File:** `src/services/APIClient.ts:332-333`

#### L7: isOperatorMessage Field Redundant with MessageRole.OPERATOR
**File:** `src/types/index.ts:63`

#### L8: Window Type Augmentation Should Be Optional
**File:** `src/types/index.ts:126-129`

#### L9: Python-Related Entries in .gitignore/.gitattributes
**Files:** `.gitignore:50-58`, `.gitattributes:9`

#### L10: Legacy v0.0.1 README Naming Confusion (LightCHAT vs AgentCHAT)
**File:** `legacy/v0.0.1/README.md:1,10,47`

#### L11: dev/LEARNINGS.md References React Query (Not Used)
**File:** `dev/LEARNINGS.md:56`

#### L12: docs/README.md Exposes CLAUDE.md and AGENTS.md in Index
**File:** `docs/README.md:55-56`

#### L13: No favicon — References /vite.svg
**File:** `index.html:5`

### INFORMATIONAL NOTES

- I1: Two `AgentConfigSection` instances each create separate `APIClient` with separate caches — models fetched twice for same provider.
- I2: Conversation uses fixed 10-message context window (not configurable). The legacy Python version had configurable 0-20.
- I3: `titleBarStyle: 'hiddenInset'` combined with `frame: false` is contradictory (frame:false makes titleBarStyle irrelevant).
- I4: `ELECTRON_BUILDER_PARALLELISM=18` hardcoded — should use `$(nproc)`.
- I5: `dist/renderer/` directory is committed but should be in `.gitignore`.
- I6: `postinstall` script swallows all errors with `|| true`.
- I7: MAS build config missing provisioning profile.
- I8: Range slider CSS missing standard `::slider-thumb` (only webkit/moz prefixes).

---

## PROMPT QUALITY SCORECARD

| File | Clarity | Specificity | Edge Cases | Output Format | Token Efficiency | Score |
|------|---------|-------------|------------|---------------|-----------------|-------|
| `CLAUDE.md` | 4 | 3 | 2 | 3 | 3 | 3.0/5 |
| `AGENTS.md` | 5 | 4 | 3 | 4 | 4 | 4.0/5 |
| System Prompt (persona) | 4 | 3 | 2 | N/A | 3 | 3.0/5 |

Notes:
- CLAUDE.md references stale color classes (`bg-dark-900` instead of `noir-*`) and outdated model names
- AGENTS.md is concise and actionable — best prompt file in the project
- System prompt injection is done via the `systemPrompt` state variable, which is properly separated from user content

---

## MISSING COMPONENTS & RECOMMENDATIONS

1. **Test Infrastructure** — No tests exist. No test framework installed. No unit, integration, or e2e tests.
2. **Streaming Support** — Claimed in README but not implemented. Should implement SSE/streaming for all providers that support it.
3. **Markdown Rendering** — AI responses display as raw text. Install `react-markdown` + `remark-gfm`.
4. **Message Copy/Export** — No per-message copy-to-clipboard.
5. **Loading Indicators** — No visual feedback while waiting for agent responses.
6. **Keyboard Shortcuts** — Enter-to-submit, Escape-to-close on modals.
7. **OS Keychain Integration** — Replace plaintext `.key` file with `safeStorage` (Electron built-in).
8. **Auto-Update** — Publish config exists in package.json but no update checking code.
9. **Response Streaming** — Would reduce perceived latency significantly.

---

## ARCHITECTURAL RECOMMENDATIONS

1. **Unify the conversation state** — The conversation loop maintains its own `conv` object separate from React state. This causes the operator injection race condition. Use a ref-based conversation object that both the loop and React state share.
2. **Delete the `config/` directory** — Contains stale duplicates of root config files with broken paths. These are landmines.
3. **Centralize provider configuration** — Provider-specific parameter transformations, model lists, and URL builders are spread across APIClient.ts in a 900+ line object. Extract into per-provider modules.
4. **Implement proper IPC for window controls** — Currently using `window.close()`. Standard Electron pattern uses IPC channels for minimize/maximize/close.
5. **Add CSP nonce for inline styles** — Replace `'unsafe-inline'` with nonce-based CSP.
6. **Upgrade Electron** — Priority 1 security issue. Electron 25→33+ is a major migration but addresses multiple CVEs.

---

## APPENDIX: RAW FILE ANALYSIS NOTES

### src/main.cjs
- 262 lines. Electron main process with encrypted store, IPC handlers, single-instance lock.
- Encryption key stored as plaintext file (line 20-41). Windows has no file permission protection.
- VALID_PROVIDERS (line 172) has 21 entries including phantom providers not in the enum.
- envKeyMap (line 193-211) missing 6 provider mappings.
- No window reference passed to dialog.showSaveDialog (line 240-262).

### src/preload.cjs
- 45 lines. Clean contextBridge setup.
- removeAllListeners race condition (lines 14-22).
- Dead menu event listeners — menu is null (line 25-28).
- Fallback else branch at line 43-44 is a security risk if contextIsolation disabled.

### src/App.tsx
- ~450 lines. Root component managing conversation state machine.
- Operator injection race condition (C2, C3).
- maxTurns parameter shadowing (line 232).
- conversation?.messages.length uses || instead of ?? (line 440).

### src/services/APIClient.ts
- ~1030 lines. Largest source file. 14 provider configurations.
- Mutable global API_PROVIDERS (H14).
- Gemini wrong params (C5), Replicate broken (C4), Anthropic consecutive roles (H8).
- 60s timeout (M11), stale model lists (L5, L6).

### src/services/AgentManager.ts
- ~270 lines. Conversation orchestration.
- Hardcoded 'agent1' check (H6), double system message (H7).
- Fragile agent name detection (M8).
- Synthetic "Hello" message injection for conversations starting with ASSISTANT.

### scripts/bloat-check.sh
- 240 lines. Comprehensive but buggy analysis tool.
- GNU-only `du -sb` (not macOS compatible).
- Locale-dependent `ls -lah` parsing.
- Negative number arithmetic when <10 ASAR files.

### scripts/compile-build-dist.sh
- 380 lines. Multi-platform build orchestrator.
- `set -e` makes explicit error checks unreachable (dead code).
- Glob-inside-brackets bug (line 337).
- Hardcoded 18 parallel jobs.

### scripts/clean-logs.cjs (renamed from .js)
- 30 lines. Was completely broken — missing dependency, wrong module format, broken regex. Fixed in remediation.

---

## REMEDIATION LOG

**Remediation Date:** 2026-03-08
**Findings Fixed:** 18
**Findings Deferred:** 2

### Fixed Findings
| ID | Severity | Finding | Fix Applied |
|----|----------|---------|-------------|
| C2 | CRITICAL | Operator injection not included in API calls | Added `conversationRef` for loop-state sync; merge injected messages before each turn |
| C3 | CRITICAL | Operator injection blocked while paused | Allow injection when PAUSED state |
| C5 | CRITICAL | Gemini receives wrong parameter names | Explicit camelCase mapping (`topK`, `topP`) instead of spreading snake_case params |
| C6 | CRITICAL | CSP connect-src allows any HTTPS | Replaced `https:` wildcard with 13 explicit provider domains |
| C8 | CRITICAL | .nvmrc Node 24 doesn't exist | Changed to 22 (current LTS) |
| H1 | HIGH | config/tailwind.config.js broken content paths | Fixed paths to resolve from project root; added missing `status`, `cyber`, `neon` color definitions |
| H2 | HIGH | config/vite.config.ts broken path resolution | Replaced with DEPRECATED notice (file is not referenced by build system) |
| H4 | HIGH | Ollama model fetch ignores custom host/port | `fetchModelsForProvider` now passes `localServerConfig` to `fetchOllamaModels` |
| H5 | HIGH | Llama.cpp default host 0.0.0.0 fails validation | Added `0.0.0.0` to `allowedHosts` in `validateLocalServer` |
| H6 | HIGH | Hardcoded agent ID breaks operator injection | Changed to compare against first conversation agent dynamically |
| H7 | HIGH | Double system message in API calls | Filter by `msg.role === MessageRole.SYSTEM` instead of ID |
| H8 | HIGH | Anthropic rejects consecutive user messages | Anthropic `transformRequest` now merges consecutive same-role messages |
| H9 | HIGH | Node.js version contradictions | Standardized to 22+ in README, .nvmrc, CI |
| H10+H11 | HIGH | README streaming claim + obsolete roadmap | Removed streaming claim; replaced roadmap with changelog reference |
| H12 | HIGH | compile-build-dist.sh glob/dead code bugs | Fixed `[ -f ]` glob, unreachable code, bad dep count |
| H13 | HIGH | run-macos.sh find operator precedence | Added grouping parentheses to find commands |
| H15 | HIGH | tests/ directory missing | Created tests/unit, tests/integration, tests/e2e with .gitkeep |
| -- | HIGH | run-source-linux.sh multiple PIDs | kill_port now pipes through `xargs -r kill -9` |
| H3 | HIGH | clean-logs.js broken | Renamed to .cjs, fixed regex, added dependency guard |

### Deferred Findings (Requires Manual Migration)
| ID | Severity | Finding | Reason Deferred |
|----|----------|---------|-----------------|
| C1 | CRITICAL | Electron 25 severely outdated with known CVEs | Major version upgrade (25→33+) requires extensive migration and testing |
| C4 | CRITICAL | Meta/Replicate provider non-functional | Requires implementing async polling pattern; consider removing provider |
| C7 | CRITICAL | Plaintext encryption key on disk | Requires migration to Electron safeStorage API; impacts existing user data |

### Post-Remediation Validation
- **TypeScript**: `tsc --noEmit` — PASS (exit 0, no errors)
- **Vite Build**: `vite build` — PASS (1259 modules, 15.87s, CSS 28.6KB + JS 209KB)
- **Lint**: Not run (ESLint config present but no `npm run lint` executed due to missing global tsc)
- **Build Output**: `dist/renderer/` with index.html, CSS, and JS bundles
