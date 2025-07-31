# Contributing to AgentCHAT

Thanks for your interest in contributing! Here's how to get involved.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/agent-chat.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature`
5. Run in dev mode: `npm run electron:dev`

## Development Setup

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for full environment setup, build commands, and project structure.

### Quick Reference

```bash
npm run electron:dev     # Dev server with hot reload
npm run lint             # Run ESLint
npm run build            # TypeScript + Vite build
npm run dist:current     # Package for your platform
```

## Code Standards

### TypeScript
- Strict mode. All components need typed props interfaces.
- Use interfaces over types for object shapes.
- No `any` types without justification.

### React
- Functional components only (no class components).
- Use hooks: `useState`, `useEffect`, `useCallback`, `useRef`.
- Destructure props in function parameters.

### Naming
- Components/Services: `PascalCase.tsx`
- Functions/Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### Styling
- Tailwind CSS utility classes only. No CSS modules or styled-components.
- Follow the Neo-Noir Glass theme defined in `config/tailwind.config.js`.

## Making Changes

### Before You Start
- Check existing [issues](https://github.com/sanchez314c/agent-chat/issues) for related work
- For big changes, open an issue first to discuss the approach

### Commit Messages
Follow conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `refactor:` code restructuring
- `docs:` documentation changes
- `style:` formatting, no code change
- `chore:` build/tooling changes

### Pull Request Process
1. Update documentation if you changed behavior
2. Update CHANGELOG.md with your changes
3. Make sure `npm run lint` and `npm run build` pass
4. Fill out the PR template completely
5. Request review

## What to Contribute

### Good First Issues
- Bug fixes with clear reproduction steps
- Documentation improvements
- New AI provider integrations (see `src/services/APIClient.ts`)
- UI/UX improvements to existing components

### Areas of Interest
- Additional AI provider support
- Conversation export formats
- Accessibility improvements
- Performance optimizations
- Test coverage

## Security

- Never commit API keys or secrets
- Follow secure IPC patterns (all communication through preload script)
- See [SECURITY.md](SECURITY.md) for vulnerability reporting

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating.

## Questions?

Open a [GitHub Discussion](https://github.com/sanchez314c/agent-chat/discussions) or file an issue.
