# Version Map

## Current Active Version

| Version | Location | Status | Notes |
|---------|----------|--------|-------|
| **1.0.0** | `/` (root) | 🟢 **ACTIVE** | Multi-Agent AI Conversation Desktop App |

## Legacy Versions

| Version | Location | Status | Notes |
|---------|----------|--------|-------|
| 0.0.3 | `legacy/v0.0.3/` | 🟡 ARCHIVED | Electron + React + Tailwind iteration |
| 0.0.2 | `legacy/v0.0.2/` | 🟡 ARCHIVED | Early Electron prototype |
| 0.0.1 | `legacy/v0.0.1/` | 🟡 ARCHIVED | Python/Flask prototype |

## Archive Backups

| File | Date | Description |
|------|------|-------------|
| `archive/v1.0.0_20260207_003521.zip` | 2026-02-07 | Pre-standardization backup |
| `archive/v1.0.0_20260204_221809.zip` | 2026-02-04 | Mid-development backup |
| `archive/v1.0.0_20260204_215001.zip` | 2026-02-04 | Early v1.0.0 backup |

## Folder Structure

```
agent-chat/
├── src/                    # React + Electron source (v1.0.0)
├── resources/              # Application assets, icons
├── docs/                   # Documentation
├── dev/                    # Internal development docs
├── archive/                # Timestamped backups (gitignored)
├── legacy/                 # Archived versions (gitignored)
├── package.json            # Manifest (v1.0.0)
└── README.md               # Project documentation
```

## Archive Policy

- `legacy/` contains historical versions for local reference
- `archive/` contains timestamped zip backups
- Both folders are gitignored to prevent repository bloat
- Active development always occurs at repository root

---

*Last Updated: 2026-03-07*
