# Changelog

## [2026-03-08 14:30 — Neo-Noir Glass Monitor Restyle]

### Added
- **Canonical title bar**: App icon (18px), teal app name, muted tagline, flat About (ⓘ) icon, circular minimize/maximize/close window controls (28px)
- **About modal**: Dark overlay with blur, centered glass card, app icon (64px), version (teal monospace), description, MIT license, GitHub pill badge, email, closes on X/overlay click/Escape
- **Status bar footer**: Left = status dot + status text + pipe + message count; Right = version only in teal (no app name)
- **Window control IPC**: `window-minimize`, `window-maximize`, `window-close`, `open-external` handlers in main process + preload bridge + TypeScript types
- **Complete CSS custom property token system**: 50+ design tokens in `:root` covering backgrounds, typography, accents, borders, gradients, shadows, glass effects, radii, spacing, transitions
- **Glass card system**: `.neo-panel`, `.neo-card`, `.neo-card-glow` with `::before` inner highlight gradients and layered shadows
- **Invisible scrollbars**: 6px thin, transparent at rest, visible on hover (Rule 13)

### Changed
- **index.css**: Complete rewrite — removed all `@apply` directives (Rule 11), replaced with plain CSS using CSS custom properties
- **App.tsx**: Replaced standalone close button with full canonical title bar layout; added About modal state + Escape handler; restructured to `app-body` flex layout
- **StatusBar.tsx**: Rewritten to canonical spec — removed lucide-react icons, uses plain CSS status-bar class with dot indicator
- **main.cjs**: BrowserWindow `titleBarStyle` now platform-conditional (macOS only), added `resizable: true`
- **preload.cjs**: Added `windowMinimize`, `windowMaximize`, `windowClose`, `openExternal` APIs
- **types/index.ts**: Added window control and openExternal methods to ElectronAPI interface
- **Title bar icon**: Copied `resources/icons/icon.png` → `src/icon-titlebar.png` (bundled inside app.asar)

### Validation
- 35/35 checklist items passed (window/frame, title bar, about modal, status bar, visual design)
- Build: Clean tsc + vite build (1.57s, 210KB JS, 30KB CSS)

## [2026-03-08 — Electron 25 → 33 Major Version Upgrade]

### Breaking
- **Electron upgraded from v25.3.1 to v33.4.11** — ships Chromium 130+ (was Chromium 114 with known CVEs). Addresses multiple remote code execution vulnerabilities patched in Electron 26-33.
- **electron-builder upgraded from v24.6.3 to v26.8.1** — required for Electron 33+ compatibility
- **Vite upgraded from v4.4.5 to v5.4.0** — 5x faster builds (3.17s vs 15.87s), required for Node 22+ compatibility
- **Minimum Node.js version**: 20+ (was 16+). The .nvmrc already specifies 22.

### Changed
- `@vitejs/plugin-react`: ^4.0.3 → ^4.3.0
- `@types/react`: ^18.2.15 → ^18.3.0
- Snap base: `core20` (EOL) → `core22`
- Removed invalid `"oneClick": false` from MSI config (NSIS-only option)
- Removed dead dependencies: `vite-plugin-electron`, `vite-plugin-electron-renderer` (never imported)

### Removed (main.cjs cleanup)
- Removed Windows 7 `app.disableHardwareAcceleration()` guard (Win7 can't run Electron 33)
- Removed duplicate `app.setAppUserModelId(app.getName())` call (overwritten by correct call with appId)
- Removed aggressive `process.exit(0)` after `app.quit()` in single-instance lock

## [2026-03-08 13:22 — safeStorage Encryption Migration]

### Security
- **Migrated API key encryption from plaintext file to Electron safeStorage API** (`src/main.cjs`): Replaced `getEncryptionKey()` which stored a plaintext hex key at `<userData>/.key` (readable by any user-level process, non-functional on Windows) with per-value encryption using `electron.safeStorage` (Linux: libsecret/kwallet, macOS: Keychain, Windows: DPAPI)
- Removed `crypto` module dependency (no longer needed)
- Removed `encryptionKey` option from electron-store constructor — store now holds base64-encoded safeStorage ciphertext per key instead of using electron-store's built-in whole-file encryption
- Added `encryptValue()` / `decryptValue()` helpers with graceful fallback to base64 obfuscation when safeStorage is unavailable
- Added `migrateKeys()` one-time migration that re-encrypts existing plaintext API keys on first launch and deletes the legacy `.key` file
- Simplified store initialization: removed redundant corrupted-config pre-check (duplicate of `clearInvalidConfig` behavior)

### Breaking
- Users upgrading from the previous encryption scheme will need to re-enter API keys once (old electron-store encrypted values are incompatible with the new per-value approach; `clearInvalidConfig: true` handles the transition)

## [2026-03-08 01:45 — Meta/Replicate Provider Fix]

### Fixed
- **META provider (Replicate) completely non-functional** (`src/services/APIClient.ts`): Replicate uses an async prediction API (POST returns prediction ID, must poll until succeeded). The old code treated it as synchronous, reading `response.output` from the initial POST which was always empty/undefined.
- Added `asyncPolling` field to `APIProviderConfig` interface for providers that require poll-based completion
- Updated META `transformRequest` to use Replicate's newer `model` field instead of deprecated `version` field
- Updated META `headers` to use `Bearer` auth (current Replicate standard) and added `Prefer: wait` header
- Updated META `transformResponse` to handle both array and string output formats from Replicate
- Added async polling loop in `sendMessage`: polls `urls.get` every 2s (max 30 attempts / 60s) for `succeeded` status, throws on `failed`/`canceled`

## [2026-03-08 — Tailwind Config Restoration]

### Fixed
- **[H1] config/tailwind.config.js**: Restored full Neo-Noir theme with correct content paths (`./index.html`, `./src/**/*`), added missing `status`, `cyber`, `neon` color palettes that caused build failure
- Vite build now passes clean (1259 modules, 15.87s)

## [2026-03-08 00:23 — CRITICAL+HIGH Audit Remediation (Round 2)]

### Fixed
- **[C2+C3] Operator Injection Race Condition** (`src/App.tsx`): Added `conversationRef` to sync latest conversation state into the loop; loop now merges injected messages before each turn. Operator injection guard now allows PAUSED state in addition to RUNNING.
- **[C5] Gemini Wrong Parameter Names** (`src/services/APIClient.ts`): Replaced generic `sanitizeParams` spread in Gemini's `generationConfig` with explicit camelCase mapping (`top_k` -> `topK`, `top_p` -> `topP`). Removed unsupported params (`presence_penalty`, `frequency_penalty`, `reasoning_effort`).
- **[C6] CSP connect-src wildcard** (`index.html`): Replaced `https:` wildcard with explicit provider domain allowlist (13 domains).
- **[H4] Ollama Model Fetch Ignores Custom Host/Port** (`src/services/APIClient.ts`): `fetchModelsForProvider` now accepts optional `localServerConfig` and passes host/port to `fetchOllamaModels`.
- **[H5] Llama.cpp Default Host Fails Validation** (`src/services/APIClient.ts`): Added `0.0.0.0` to `allowedHosts` in `validateLocalServer`.
- **[H6] Hardcoded Agent ID** (`src/services/AgentManager.ts`): Operator message visibility now determined dynamically from first responding agent's ID instead of hardcoded `'agent1'`.
- **[H7] Double System Message** (`src/services/AgentManager.ts`): Changed filter from `msg.id !== 'system'` to `msg.role === MessageRole.SYSTEM` to catch all system messages and prevent duplicates.
- **[H8] Anthropic Consecutive User Messages** (`src/services/APIClient.ts`): Added consecutive same-role message merging in Anthropic's `transformRequest` to prevent API rejection from operator-injected messages.
- **[H1+H2] Stale Config Files** (`config/vite.config.ts`, `config/tailwind.config.js`): Replaced contents with DEPRECATED notices pointing to root configs.

## [2026-03-08 — HIGH Audit Remediation]

### Fixed
- `scripts/clean-logs.js` -> renamed to `clean-logs.cjs`; fixed broken regex (nested parens), added glob dependency check
- `scripts/compile-build-dist.sh` line 337: glob inside `[ -f ]` replaced with `ls ... 2>/dev/null` pattern
- `scripts/compile-build-dist.sh` line 274-277: dead code (unreachable if-check after `set -e` + `npx tsc`) collapsed to single line with `||`
- `scripts/compile-build-dist.sh` line 115: bad `grep -c` dep count replaced with node one-liner
- `scripts/run-macos.sh` lines 66,77: find operator precedence fixed with grouping parentheses
- `run-source-linux.sh` line 43: `kill_port` now handles multiple PIDs via xargs
- `README.md`: Node.js version requirement updated from 16.0.0 to 22+, "Real-time Streaming" changed to "Real-time Conversation", obsolete roadmap replaced with CHANGELOG.md reference
- `.nvmrc`: changed from 24 to 22
- `.github/workflows/ci.yml`: node-version changed from 18 to 22 (both jobs)

### Added
- `tests/unit/.gitkeep`, `tests/integration/.gitkeep`, `tests/e2e/.gitkeep` — empty test directory scaffolding

## [2026-03-07 23:55:00] - Documentation Standardization: 27/27 File Checklist (repo-docs pipeline)

### Updated
- `LICENSE` -- Copyright year updated from 2025 to 2026, name updated to "Jason Paul Michaels"
- `docs/README.md` -- Rewritten as full documentation index linking all 15 docs/ files plus root-level docs

### Created
- `docs/API.md` -- IPC API reference, service layer API, provider endpoints table, TypeScript type reference
- `docs/BUILD_COMPILE.md` -- Build pipeline (tsc -> Vite -> electron-builder), platform build commands, build scripts, output structure
- `docs/FAQ.md` -- 15 questions covering general usage, AI providers, features, and technical topics
- `docs/TECHSTACK.md` -- Full technology stack table (8 core + 10 dev dependencies), architecture pattern, security stack
- `docs/WORKFLOW.md` -- User workflow (setup -> run -> save), conversation loop technical diagram, state machine, dev workflow
- `docs/QUICK_START.md` -- 5-minute setup guide with free model example, controls table

### Linked
- `docs/LEARNINGS.md` -> symlink to `dev/LEARNINGS.md`
- `docs/PRD.md` -> symlink to `dev/PRD.md`
- `docs/TODO.md` -> symlink to `dev/TODO.md`

---

## [2026-03-07] - Documentation Standardization (repo-docs)

### Moved to Archive
- `AUDIT_REPORT.md` → `archive/AUDIT_REPORT.md` (pipeline-generated report)

### Merged
- `docs/FAQ.md` content merged into `docs/TROUBLESHOOTING.md` (FAQ section added at bottom)
- `docs/FAQ.md` archived to `archive/merged/FAQ.md`

### Updated
- `README.md` — fixed version badge (0.0.4 → 1.0.0), corrected repo clone directory (`agent-chat` not `AgentCHAT`), all `build-release-run.sh` references updated to `scripts/build-release-run.sh`, project structure section rewritten to match current repo layout, port reference fixed (5173 → 58743), version history table updated to reflect v1.0.0 as current
- `SECURITY.md` — fixed reporting instructions (URL was incorrectly listed as an email address; replaced with proper GitHub Security Advisory link)
- `docs/ARCHITECTURE.md` — AI Provider Integration section expanded from 4 to all 14 supported providers with table format; `ErrorBoundary.tsx` added to component architecture
- `docs/DEVELOPMENT.md` — `ErrorBoundary.tsx` added to project structure
- `docs/README.md` — removed standalone FAQ.md link, merged into TROUBLESHOOTING reference

---

## [2026-03-08 00:15:00] - Forensic Audit Remediation — 38 Findings Fixed

### Security (CRITICAL)
- **C1**: `shell.openExternal()` now validates URL protocol against https/http allowlist
- **C2**: IPC store handlers validate provider against `VALID_PROVIDERS` allowlist (prevents path injection)
- **C3**: Gemini API key moved from URL query parameter to `x-goog-api-key` header
- **C4**: `sanitizeParams()` strips internal fields (`localServerConfig`, `provider`, `model`, `apiKey`) before spreading into API requests (14 providers)
- **C5**: Removed hardcoded sudo password from run-source-linux.sh
- **C6**: Replaced placeholder MSI GUID with real UUID
- **C8**: GitHub Actions updated from v3 to v4 (checkout, setup-node, upload-artifact)
- **C9**: Initial useEffect reads from refs instead of capturing stale closure values

### Security (HIGH)
- **H4**: Added Content-Security-Policy meta tag to index.html
- **H5**: IPC listeners cleaned up properly with `removeAllListeners()` before re-registration
- **H6**: All API fetch calls wrapped with AbortController (60s timeout)
- **H7**: `validateLocalServer()` restricts host to localhost variants, port 1-65535 (SSRF prevention)
- **H14**: API key cleared from React state after save, masked placeholder for existing keys
- **H22**: Gemini system messages now sent as `systemInstruction.parts` instead of being dropped

### Bug Fixes (HIGH)
- **H9**: Conversation loop timeout stored in ref, cleared on unmount, cancellation via `isLoopRunningRef`
- **H10**: Agent config refs synced every render, loop reads current values
- **H11**: Resume checks `isLoopRunningRef` to prevent duplicate loops
- **H13**: `fixRoleAlternation` creates new objects via spread instead of mutating React state
- **H19**: Fixed port mismatch in .env.example (5173 → 58743)

### Bug Fixes (MEDIUM)
- **M3**: Removed 113 lines of dead `createMenu()` function
- **M14**: Removed no-op Gemini header stripping
- **M15**: HuggingFace model names with `..` rejected (path traversal)
- **M16**: Operator injection uses functional state update
- **M18-M22**: Fixed React hook dependencies, unmount cleanup
- **M24-M26**: Fixed auto-scroll, operator message labels, timestamp deserialization
- **M27**: Noted Google Fonts internet dependency
- **M28, M30**: Type cleanup (removed duplicate, fixed Date serialization)
- **M34**: Added `set -e` to compile-build-dist.sh
- **M37**: Fixed version mismatch in build-linux.sh

### Code Quality (LOW)
- **L1-L3**: Removed duplicate imports, variable shadowing, console.log leaks in main.cjs
- **L12**: Removed unused `requiresAuth` variable
- **L14-L15**: Fixed usage field shape, removed unused type
- **L16-L17**: Added menu listener cleanup, ErrorBoundary component
- **L26**: Removed dead `.nav-item` CSS classes

### Added
- `src/components/ErrorBoundary.tsx` — React Error Boundary with styled error display and reset

---

## [2026-03-07 23:55:00] - React Component & Type Cleanup (H14, M18, M21-M22, M24-M26, M28, M30, L14-L15)

### Fixed (Security)
- **H14**: API key no longer held in cleartext React state after save; key state cleared on successful save, existing keys show masked placeholder instead of decrypted value

### Fixed (React Hooks)
- **M18**: AgentConfigPanel useEffect now uses useRef for apiClient to avoid missing dependency warnings and unnecessary re-fetches
- **M21**: APIKeyModal useEffect fixed by inlining loadExistingKey into the effect body (eliminates missing dependency)
- **M22**: APIKeyModal setTimeout stored in ref and cleared on component unmount (prevents stale callback execution)
- **M24**: ConversationPanel auto-scroll now depends on message count instead of messages array reference (prevents firing on every render)

### Fixed (Display)
- **M25**: Operator and user messages now display correct labels ("Operator", "User") instead of falling through to "Agent 2"
- **M26**: MessageBubble timestamp.toLocaleTimeString() wrapped in new Date() to handle deserialized string timestamps

### Fixed (Types)
- **M28**: Removed duplicate simplified APIProviderConfig interface from types/index.ts (canonical version lives in APIClient.ts)
- **M30**: Changed Message.timestamp type from `Date` to `string | Date` to handle JSON serialization roundtrips
- **L14**: Fixed APIResponse usage field to use snake_case (`prompt_tokens`, `completion_tokens`, `total_tokens`) matching actual provider response shapes
- **L15**: Removed unused ChatCompletionResponse type from types/index.ts and its dead import from APIClient.ts

### Changed
- `src/components/APIKeyModal.tsx` - H14, M21, M22 fixes
- `src/components/AgentConfigPanel.tsx` - M18 fix (useRef for apiClient)
- `src/components/ConversationPanel.tsx` - M24, M25 fixes
- `src/components/MessageBubble.tsx` - M26 fix (all 3 timestamp call sites)
- `src/types/index.ts` - M28, M30, L14, L15 fixes
- `src/services/APIClient.ts` - Removed dead ChatCompletionResponse import
- `src/services/AgentManager.ts` - Updated timestamp.toLocaleTimeString() calls to use new Date() wrapper

---

## [2026-03-07 22:08:29] - Bug Fixes: Stale Closures, Race Conditions, State Mutations

### Fixed
- **C9**: Stale closure in initialization useEffect - uses refs to read current agent/prompt values
- **H9**: Conversation loop setTimeout now tracked in ref, cleared on unmount; added isRunning cancellation check after async API calls
- **H10**: Conversation loop reads agent configs from refs instead of stale closure values
- **H11**: Resume guard prevents duplicate loops via isLoopRunningRef check
- **H13**: fixRoleAlternation in AgentManager no longer mutates message objects from React state (creates new objects via spread)
- **M16**: Operator message injection uses functional setConversation(prev => ...) to prevent lost-update race
- **L16**: Electron menu event listeners now cleaned up on useEffect teardown; preload returns cleanup functions
- **L17**: Added ErrorBoundary class component wrapping App content for graceful crash recovery

### Changed
- `src/App.tsx` - All fixes above applied
- `src/services/AgentManager.ts` - Immutable message handling in fixRoleAlternation
- `src/preload.cjs` - Menu listener functions now return cleanup callbacks + removeMenuListeners method
- `src/types/index.ts` - Updated ElectronAPI interface with cleanup return types and removeMenuListeners

### Added
- `src/components/ErrorBoundary.tsx` - React Error Boundary with error display and retry button

---

## [2026-03-07 23:30:00] - APIClient Security and Reliability Hardening

### Fixed (Security)
- **C3**: Gemini API key no longer exposed in URL query parameter; now sent via `x-goog-api-key` header
- **C4**: `additionalParams` spread sanitized across all providers; internal fields (`localServerConfig`, `provider`, `model`, `apiKey`) stripped before sending to third-party APIs
- **H7**: SSRF prevention added to Ollama and LlamaCpp local server config; host validated against localhost/127.0.0.1/::1 only, port validated 1-65535
- **M15**: HuggingFace model name validated against path traversal (`..` sequences rejected)

### Fixed (Reliability)
- **H6**: All fetch() calls now use AbortController with 60-second timeout
- **H22**: Gemini system messages no longer silently dropped; extracted into `systemInstruction` field per Gemini API spec

### Removed
- **M14**: Removed no-op Gemini header stripping code (was attempting to remove `Authorization` header that was never set)
- **L12**: Removed unused `requiresAuth` variable in `fetchModelsForProvider`

---

## [2026-03-07 21:45:00] - Documentation Standardization

### Moved to Root (Governance Files)
- `docs/SECURITY.md` → `SECURITY.md` (governance files belong at root)
- `docs/CONTRIBUTING.md` → `CONTRIBUTING.md` (expanded with full contribution guide)
- `.github/CODE_OF_CONDUCT.md` → `CODE_OF_CONDUCT.md` (fixed placeholder contact method)

### Relocated to dev/ (Internal Docs)
- `docs/PRD.md` → `dev/PRD.md`
- `docs/TODO.md` → `dev/TODO.md`
- `docs/LEARNINGS.md` → `dev/LEARNINGS.md`

### Merged
- `docs/QUICK_START.md` content merged into `docs/INSTALLATION.md` (archived original)
- `docs/BUILD_COMPILE.md` + `docs/TECH-STACK.md` content merged into `docs/DEVELOPMENT.md` (archived originals)
- `docs/DOCUMENTATION_INDEX.md` replaced by `docs/README.md` (archived original)

### Updated
- `AGENTS.md` rewritten with agent-specific instructions (was duplicate of CLAUDE.md)
- `SECURITY.md` contact updated to GitHub Security Advisories
- `CODE_OF_CONDUCT.md` fixed unfilled `[INSERT CONTACT METHOD]` placeholder
- `docs/DEVELOPMENT.md` now includes full tech stack, all npm scripts, build process
- `docs/INSTALLATION.md` now includes quick start guide, example setup, keyboard shortcuts

### Created
- `docs/README.md` — documentation index linking all docs
- `archive/merged/` — archived merged source files

---

## [2026-02-07 22:02:52] - Repository Compliance Fixes

### Added
- Created CLAUDE.md from AGENTS.md for consistency
- Added .gitkeep to protected empty folders (archive/, docs/, resources/, tests/, config/, logs/)
- Created resources/icons/ with placeholder icon where missing
- Created missing package.json for multiplicity

### Fixed  
- Renamed build_resources/ to resources/ (standard naming)
- Removed OS junk files (.DS_Store, Thumbs.db, ._*, Desktop.ini)
- Removed runtime artifacts (.pid files, logs) from presence-ai
- Added *.pid to .gitignore in presence-ai

### Structure
- All protected folders now have .gitkeep to prevent deletion
- Standard resources/ structure enforced
- Documentation synced (CLAUDE.md created where missing)

---

# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed - Repository Reorganization (2026-02-07 06:00:00 UTC)
Flattened project structure for GitHub readiness. The active v1.0.0 codebase now lives at the repository root instead of inside a `v1.0.0/` subfolder. Legacy versions (v0.0.1, v0.0.2, v0.0.3) moved to `legacy/` folder which is gitignored. Consolidated `.gitignore` from both root and v1.0.0 versions into a single comprehensive file. Updated VERSION_MAP.md to reflect current structure.

#### Structure Changes
- `v1.0.0/*` -> repo root (all source, config, docs, scripts)
- `v0.0.1/`, `v0.0.2/`, `v0.0.3/` -> `legacy/v0.0.1/`, `legacy/v0.0.2/`, `legacy/v0.0.3/`
- Removed `v1.0.0/` wrapper directory
- Merged `.gitignore` files, added `legacy/` and `.serena/cache/` exclusions

### Changed - Floating Transparent Window Architecture (2026-02-07 05:30:00 UTC)
Implemented Ollama Wrangler's signature floating frameless window with transparent background, matching the desktop-integrated aesthetic where the app floats over the desktop wallpaper with rounded corners and visible gaps.

#### Window Architecture
- **Frameless Window**: `frame: false`, `transparent: true`, `backgroundColor: '#00000000'`, `hasShadow: false`
- **Floating Effect**: 16px body padding creates transparent border around the rounded app container
- **Custom Title Bar**: Drag handle (36px) replaces system title bar, entire transparent padding is draggable
- **Custom Close Button**: Circular close button (top-right) with hover-to-red effect matching OW
- **Rounded Container**: `.app-container` with 16px border-radius creates floating card appearance
- **Background Effects**: Starfield + gradient moved inside container (not on transparent body)

#### Files Modified
- `src/main.cjs` - BrowserWindow: frame:false, transparent:true, backgroundColor:#00000000, hasShadow:false
- `src/index.css` - Transparent body, .app-container, .drag-handle, .window-close-btn, relocated starfield
- `src/App.tsx` - Wrapped layout in .app-container with drag-handle and close button
- `index.html` - Transparent body background

### Changed - Ollama Wrangler Theme Absorption (2026-02-07 05:20:00 UTC)
Complete theme migration from Agent Chat's original vivid Neo-Noir palette to Ollama Wrangler's refined, muted neo-noir cyberpunk aesthetic for visual consistency across the RTG portfolio.

#### Color Palette Migration
- **Primary Accent**: Vivid cyan (#00FFE0) → Refined teal (#14b8a6) matching OW --accent-teal
- **Secondary Accent**: Electric purple (#A100FF) → Balanced purple (#8b5cf6) matching OW --accent-purple
- **Info/Blue Accent**: Bright cyan (#00D4FF) → Muted cyan (#06b6d4) matching OW --accent-blue
- **Success/Running**: Neon green (#00FF9D) → Emerald green (#10b981) matching OW --success
- **Warning/Paused**: Bright orange (#FF6B00) → Amber (#f59e0b) matching OW --warning
- **Error**: Vivid red (#FF3D3D) → Balanced red (#ef4444) matching OW --error
- **Backgrounds**: Adopted full OW dark palette (void #0a0b0e → border #2a2a30)

#### Files Modified
- `config/tailwind.config.js` - Complete color palette, shadow, border-radius, blur overhaul
- `src/index.css` - All gradients, glows, scrollbar, component classes updated
- `src/components/MessageBubble.tsx` - Inline style accent colors
- `src/components/StatusBar.tsx` - Status glow inline styles
- `src/components/ConversationPanel.tsx` - Error/running glow inline styles
- `src/components/AgentConfigPanel.tsx` - Agent shadow inline styles
- `src/components/APIKeyModal.tsx` - Icon glow inline style

#### Design System Alignment
- Border radius: 16px → 14px (OW --radius-card)
- Backdrop blur: 20px → 10px (OW --blur-glass)
- Shadows: Updated all depth/glow values to OW specification
- Added ocean color scale for OW accent blue
- All 7 modified files verified: zero legacy color values remaining

## [1.0.0] - 2026-02-04

### Changed - Version Bump (2026-02-04 23:45:00 UTC)
- **Major version release**: Promoted to v1.0.0 stable release
- All core functionality complete and production-ready

### Added - Repository Compliance Audit (2026-02-05 00:15:00 UTC)
- Created `AGENTS.md` (copy of CLAUDE.md for AI agent compatibility)
- Created `run-source-mac.sh` and `run-source-windows.bat` platform scripts
- Created `resources/icons/` directory with symlinks to build-resources
- Created `.editorconfig` for consistent code formatting
- Created `.nvmrc` specifying Node.js 18
- Created comprehensive documentation suite in `/docs/`:
  - `DOCUMENTATION_INDEX.md` - Index linking all docs
  - `ARCHITECTURE.md` - System design and components
  - `BUILD_COMPILE.md` - Build instructions
  - `DEVELOPMENT.md` - Developer setup guide
  - `INSTALLATION.md` - End-user installation
  - `QUICK_START.md` - 5-minute setup guide
  - `DEPLOYMENT.md` - Release and distribution
  - `TROUBLESHOOTING.md` - Common issues and fixes
  - `FAQ.md` - Frequently asked questions
- Added `.gitkeep` to test directories (unit, integration, e2e)

### Changed - Repository Compliance Audit (2026-02-05 00:15:00 UTC)
- Updated `package.json` repository URL to `github.com/sanchez314c`
- Updated `LICENSE` copyright holder to "J. Michaels"
- Renamed `docs/TECH-STACK.md` to `docs/TECHSTACK.md` (standard naming)
- Removed empty non-protected directories (`dev/`, `assets/images/`)

## [0.0.4] - 2026-02-04

### Changed - App Configuration (2026-02-04 22:16:00 UTC)
- Hidden menu bar for cleaner UI (`autoHideMenuBar: true`, `Menu.setApplicationMenu(null)`)
- Disabled automatic DevTools opening on startup
- Configured random high ports: Dev Server (58743), Debug (59847), Inspect (61293)
- Added `run-source-linux.sh` launch script with port management and cleanup
- Added root `postcss.config.js` pointing to `config/tailwind.config.js` (fixes Tailwind compilation)

### Changed - Neo-Noir UI Theme Transformation (2026-02-04 04:32:00 UTC)
Complete visual overhaul implementing the Neo-Noir futuristic dark theme.

#### Color Palette
- **Primary Background**: Pure black (#000000) with cosmic starfield texture
- **Panel Base**: Ultra-dark charcoal (#0F1117) with glassmorphism effects
- **Primary Accent**: Vivid cyan-teal (#00FFE0) for active states and glowing elements
- **Secondary Accent**: Electric purple (#A100FF) for secondary highlights
- **Status Colors**: Cyber green (#00FF9D), Orange (#FF6B00), Red (#FF3D3D)

#### Typography
- Primary font: Inter (Google Fonts)
- Monospace font: JetBrains Mono

#### Components Restyled
- Tailwind config: Neo-noir color palette, custom border-radius, glow shadows
- Base CSS: Cosmic starfield, glassmorphism panels, cyber buttons, custom scrollbar
- App layout: Floating panels with gradient background layer
- AgentConfigPanel: Glowing agent icons, neo-styled inputs, animated toggles
- ConversationPanel: Neon header, sparkle empty state, status-aware buttons
- MessageBubble: Agent-specific glow bubbles, neon operator injection
- StatusBar: Animated dots, status glow, version badge
- APIKeyModal: Elevated panel, security notice with shield icon

### Changed (2026-01-10)
- Updated version numbering to reflect development stage
- Reorganized project structure to GitHub standards
- Archived historical versions (v0.0.1 - v0.0.3)

### Added (2026-01-10)
- Version history documentation
- Proper semantic versioning

## [0.0.3] - 2025-09-01
### Added
- Distribution builds for Windows, macOS, and Linux
- Electron-builder packaging configuration
- Platform-specific installers (DMG, EXE, AppImage)

## [0.0.2] - 2025-07-30
### Added
- Initial Electron desktop application port
- React/TypeScript frontend with Vite
- Basic project structure and configuration

### Changed
- Migrated from Python to Electron/React architecture

## [0.0.1] - 2025-06-16
### Added
- Original Python version (LightCHAT/AgentCHAT)
- Two-agent AI conversation system
- XAI API integration
- JSON-based persona configuration
- Conversation logging and export
