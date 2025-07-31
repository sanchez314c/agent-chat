# AgentCHAT Deployment Guide

## Overview

AgentCHAT is distributed as a desktop application. This guide covers building and distributing releases.

## Release Process

### 1. Update Version

```bash
# Update version in package.json
npm version patch  # or minor, major
```

### 2. Update Changelog

Edit `CHANGELOG.md` with release notes.

### 3. Build All Platforms

```bash
# Build for all platforms
npm run dist:all

# Or specific platforms
npm run dist:mac
npm run dist:win
npm run dist:linux
```

### 4. Test Builds

Test installers on each platform before release.

### 5. Create Release

```bash
# Tag release
git tag v1.0.0
git push origin v1.0.0

# Create GitHub release
gh release create v1.0.0 release/1.0.0/*
```

## Build Outputs

```
release/{version}/
├── mac/
│   ├── AgentCHAT-{version}.dmg
│   ├── AgentCHAT-{version}-mac.zip
│   └── AgentCHAT-{version}.pkg
├── win/
│   ├── AgentCHAT Setup {version}.exe
│   ├── AgentCHAT-{version}.msi
│   ├── AgentCHAT-{version}-portable.exe
│   └── AgentCHAT-{version}-win.zip
└── linux/
    ├── AgentCHAT-{version}.AppImage
    ├── AgentCHAT-{version}.deb
    ├── AgentCHAT-{version}.rpm
    ├── AgentCHAT-{version}.snap
    └── AgentCHAT-{version}.tar.xz
```

## Platform-Specific Notes

### macOS

**Code Signing** (optional but recommended):
```bash
# Set environment variables
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password

# Build with signing
npm run dist:mac
```

**Notarization** (for distribution outside App Store):
```bash
export APPLE_ID=your@email.com
export APPLE_ID_PASSWORD=app-specific-password
export APPLE_TEAM_ID=XXXXXXXXXX
```

### Windows

**Code Signing** (optional):
```bash
export WIN_CSC_LINK=/path/to/certificate.pfx
export WIN_CSC_KEY_PASSWORD=your-password
```

### Linux

**Snap Store Submission:**
```bash
snapcraft login
snapcraft upload AgentCHAT-{version}.snap
snapcraft release AgentCHAT {revision} stable
```

## Auto-Update (Future)

Auto-update configuration in `package.json`:

```json
{
  "build": {
    "publish": [
      {
        "provider": "github",
        "owner": "sanchez314c",
        "repo": "AgentCHAT"
      }
    ]
  }
}
```

## Distribution Channels

### GitHub Releases
Primary distribution method. Upload all artifacts to GitHub release.

### Package Managers (Future)
- Homebrew Cask (macOS)
- Chocolatey (Windows)
- Snap Store (Linux)
- Flathub (Linux)

## Checklist

Pre-release checklist:

- [ ] Version updated
- [ ] Changelog updated
- [ ] Tests passing
- [ ] Builds succeed on all platforms
- [ ] Installers tested
- [ ] Git tagged
- [ ] Release notes written
- [ ] Assets uploaded

---

*See [DEVELOPMENT.md](DEVELOPMENT.md) for build instructions.*
