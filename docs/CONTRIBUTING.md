# Contributing to AgentCHAT

Thank you for considering contributing to this project!

## How to Contribute
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Run in development mode: `npm run electron:dev`
4. Build for production: `npm run build && npm run electron:pack`

## Code Style
Please follow the existing code style in the project. We use:
- TypeScript for type safety
- React for UI components
- Electron for desktop functionality
- ESLint for code linting

## Testing
Run tests before submitting pull requests:
```bash
npm run lint
npm run build
```

## Reporting Issues
Please use GitHub Issues to report bugs or suggest features.