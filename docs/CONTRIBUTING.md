# Contributing to AgentCHAT

Thank you for your interest in contributing to AgentCHAT! This document provides comprehensive guidelines for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Contribution Types](#contribution-types)
- [Development Setup](#development-setup)
- [Code Guidelines](#code-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Documentation](#documentation)
- [Community](#community)
- [Getting Help](#getting-help)

## Getting Started

### First Steps

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/AgentCHAT.git
   cd AgentCHAT
   ```

2. **Set Up Development Environment**
   ```bash
   # Install dependencies
   npm install

   # Start development server
   npm run electron:dev
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/spacewelder314/AgentCHAT.git
   ```

4. **Read the Code**
   - Browse the `src/` directory to understand the structure
   - Read the [API Documentation](API.md)
   - Review the [Architecture](ARCHITECTURE.md)

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### Understanding the Project

Before contributing, please understand:
- **Purpose**: Multi-agent AI conversation desktop application
- **Technology Stack**: Electron + React + TypeScript
- **Architecture**: Main process (Node.js) + Renderer process (React)
- **Security Focus**: Encrypted API key storage, secure IPC communication

## Contribution Types

We welcome contributions in many forms:

### Code Contributions

- **Bug Fixes**: Resolve issues reported by users
- **New Features**: Implement features in the roadmap
- **Improvements**: Performance, usability, or code quality
- **Provider Support**: Add new AI providers or improve existing ones

### Documentation

- **API Documentation**: Update API reference
- **User Guides**: Improve installation and usage guides
- **Code Comments**: Add inline documentation
- **Examples**: Provide usage examples

### Design & UX

- **UI Improvements**: Enhance user interface design
- **Accessibility**: Improve accessibility features
- **User Experience**: Optimize workflows and interactions
- **Themes**: Add new color schemes or themes

### Testing

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test system interactions
- **End-to-End Tests**: Test user workflows
- **Performance Tests**: Optimize application performance

### Community

- **Support**: Help answer questions in issues
- **Triage**: Help categorize and prioritize issues
- **Translation**: Translate documentation and UI
- **Promotion**: Share the project with others

## Development Setup

### Local Development

1. **Clone and Install**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AgentCHAT.git
   cd AgentCHAT
   npm install
   ```

2. **Development Server**
   ```bash
   # Start with hot reload
   npm run electron:dev

   # Or start Vite dev server separately
   npm run dev
   ```

3. **Verify Setup**
   - Application launches successfully
   - Hot reload works when editing files
   - DevTools are available for debugging

### VS Code Setup

Install these recommended extensions:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "yzhang.markdown-all-in-one"
  ]
}
```

Configure VS Code settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Branching Strategy

Follow this branching workflow:

1. **Create Feature Branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

2. **Naming Conventions**
   ```bash
   feature/ai-provider-groq
   feature/conversation-export
   bugfix/api-key-encryption
   docs/update-installation-guide
   test/add-unit-tests
   refactor/agent-manager
   ```

3. **Keep Branches Updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

## Code Guidelines

### TypeScript Standards

- **Use Strict Mode**: All TypeScript files must pass strict type checking
- **No Explicit Any**: Avoid using `any` type; prefer proper typing
- **Interfaces**: Use interfaces for object shapes
- **Types**: Use types for unions, primitives, and utility types

```typescript
// Good
interface AgentConfig {
  id: string
  name: string
  provider: APIProvider
  model: string
}

type MessageRole = 'system' | 'user' | 'assistant' | 'operator'

// Bad
const config: any = {}
const role = 'system' as any
```

### React Guidelines

- **Functional Components**: Use functional components with hooks
- **Props Destructuring**: Destructure props in component signature
- **Custom Hooks**: Extract complex logic into custom hooks
- **No Side Effects**: Keep side effects in useEffect only

```typescript
// Good
interface AgentConfigPanelProps {
  agent: AgentConfig
  onUpdate: (agent: AgentConfig) => void
}

export function AgentConfigPanel({ agent, onUpdate }: AgentConfigPanelProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Component logic here
}

// Bad
export function AgentConfigPanel(props: any) {
  const [isLoading, setIsLoading] = useState(false)

  // Access props as props.agent, props.onUpdate
}
```

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
  ```
  AgentConfigPanel.tsx    # React component
  apiClient.ts            # Utility module
  constants.ts            # Constants
  ```

- **Variables**: camelCase
  ```typescript
  const apiKey = '...'
  const conversationState = 'running'
  ```

- **Functions**: camelCase with descriptive names
  ```typescript
  function fetchAgentResponse() {}
  function validateApiKey() {}
  ```

- **Constants**: UPPER_SNAKE_CASE
  ```typescript
  const DEFAULT_MAX_TOKENS = 2000
  const API_BASE_URL = 'https://api.example.com'
  ```

### Code Organization

```
src/
├── components/          # React components
│   ├── AgentConfigPanel.tsx
│   ├── ConversationPanel.tsx
│   └── index.ts          # Export all components
├── services/           # Business logic
│   ├── AgentManager.ts
│   └── APIClient.ts
├── types/              # Type definitions
│   └── index.ts
├── hooks/              # Custom hooks
│   └── useConversationState.ts
├── constants/          # Constants
│   └── index.ts
└── utils/              # Utility functions
    └── index.ts
```

### ESLint Configuration

We use ESLint with these rules:
- **TypeScript**: Strict type checking
- **React Hooks**: Proper hook usage
- **Security**: Detect potential security issues
- **Import Order**: Consistent import organization

Run linter before committing:
```bash
npm run lint
```

## Testing

### Current State

We are actively working on adding comprehensive test coverage. Currently, manual testing is the primary method.

### Manual Testing Guidelines

When testing manually:

1. **Application Startup**
   - [ ] App launches without errors
   - [ ] UI loads correctly
   - [ ] DevTools work (in development)

2. **API Key Management**
   - [ ] Keys can be stored securely
   - [ ] Keys can be retrieved
   - [ ] Keys can be deleted
   - [ ] Invalid keys are handled gracefully

3. **Agent Configuration**
   - [ ] Agents can be configured
   - [ ] Settings persist across restarts
   - [ ] Invalid configurations are prevented

4. **Conversations**
   - [ ] Agents can start conversations
   - [ ] Messages are displayed correctly
   - [ ] Conversations can be saved
   - [ ] Errors are handled gracefully

5. **Cross-Platform**
   - [ ] Works on macOS
   - [ ] Works on Windows
   - [ ] Works on Linux

### Future Testing Framework

We plan to implement:

```typescript
// Unit Tests
describe('APIClient', () => {
  test('should send message to Claude', async () => {
    // Test implementation
  })
})

// Integration Tests
describe('Agent Integration', () => {
  test('should handle conversation flow', async () => {
    // Test implementation
  })
})

// E2E Tests
describe('Application Flow', () => {
  test('should complete full conversation workflow', async () => {
    // Test implementation
  })
})
```

## Pull Request Process

### Before Submitting

1. **Create Issue** (for new features)
   - Discuss major changes before implementing
   - Get consensus on approach
   - Avoid wasted effort

2. **Development Process**
   ```bash
   # Create feature branch
   git checkout -b feature/your-feature

   # Make changes
   # Commit frequently with clear messages
   git add .
   git commit -m "feat: add new AI provider support"

   # Keep branch updated
   git fetch upstream
   git rebase upstream/main
   ```

3. **Quality Checks**
   ```bash
   # Run linter
   npm run lint

   # Type checking
   npx tsc --noEmit

   # Build application
   npm run build

   # Test manually
   npm run electron:dev
   ```

### Pull Request Template

Use this template for your PR:

```markdown
## Description
Brief description of the change

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] All scenarios tested
- [ ] Cross-platform testing (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review of the code completed
- [ ] No new linting errors
- [ ] Documentation updated (if required)
- [ ] Tests added/updated (if applicable)
```

### Submitting Pull Request

1. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature
   ```

2. **Create Pull Request**
   - Use descriptive title
   - Fill out template completely
   - Link to related issues
   - Add screenshots for UI changes

3. **Review Process**
   - Automated checks must pass
   - At least one maintainer review required
   - Address all feedback
   - Update PR based on reviews

### Pull Request Guidelines

- **One Feature Per PR**: Keep PRs focused and manageable
- **Small PRs**: Large changes should be split into multiple PRs
- **Clear Commits**: Use conventional commit messages
- **Documentation**: Update docs for API changes
- **Testing**: Ensure thorough testing coverage

## Documentation

### When to Update Documentation

- **API Changes**: Update API documentation
- **New Features**: Update user guides and README
- **Configuration Changes**: Update setup instructions
- **Architecture Changes**: Update architecture docs

### Documentation Types

- **Code Comments**: TypeScript interfaces and complex functions
- **README.md**: Project overview and quick start
- **API.md**: Detailed API reference
- **User Guides**: Step-by-step instructions
- **Architecture**: System design and patterns

### Writing Guidelines

- **Clear and Concise**: Use simple, direct language
- **Examples**: Provide working examples
- **Cross-References**: Link to related documentation
- **Up-to-Date**: Keep documentation current with code

## Community

### Ways to Participate

- **Answer Questions**: Help in GitHub Issues and Discussions
- **Review PRs**: Provide constructive feedback on contributions
- **Report Issues**: Help identify and document bugs
- **Share Ideas**: Suggest improvements and new features

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Pull Requests**: Code contributions and reviews
- **Code of Conduct**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

### Recognition

We recognize contributions through:
- **Contributors List**: Acknowledged in README
- **Release Notes**: Mentioned in version releases
- **Community**: Recognition in community channels
- **Leadership**: Opportunities for maintainership

## Getting Help

### Resources

- **Documentation**: Complete documentation in `/docs` folder
- **API Reference**: [API.md](API.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Build Guide**: [BUILD_COMPILE.md](BUILD_COMPILE.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and discussions
- **Maintainers**: Tag maintainers for urgent issues
- **Code Review**: Request reviews on draft PRs

### Before Asking

1. **Search Existing Issues**: Check if your question has been answered
2. **Read Documentation**: Review relevant documentation
3. **Check Examples**: Look for similar implementations
4. **Try to Reproduce**: Provide minimal reproduction if reporting a bug

## License

By contributing to AgentCHAT, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Thank You

We appreciate all contributions to AgentCHAT! Whether you're fixing a typo, adding a major feature, or helping answer questions, your contributions help make AgentCHAT better for everyone.

### Contributors Recognition

We maintain a list of contributors in the README. To be included:

- Make at least one accepted pull request
- Contribute in meaningful ways (code, docs, design, etc.)
- Follow the project's Code of Conduct

---

For questions about contributing that aren't covered here, please open an issue or start a discussion on GitHub.