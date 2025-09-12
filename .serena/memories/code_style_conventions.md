# AgentCHAT Code Style & Conventions

## TypeScript Configuration
- Target: ES2020
- Strict mode enabled
- Module: ESNext with bundler resolution
- JSX: react-jsx
- Path mapping: '@/*' points to './src/*'
- No unused locals/parameters allowed (set to false for flexibility)

## Code Style Standards
- **Language**: TypeScript throughout (strict mode)
- **Framework**: React 18 with functional components and hooks
- **Naming Conventions**:
  - Files: PascalCase for components (e.g., `AgentConfigPanel.tsx`)
  - Variables/Functions: camelCase (e.g., `handleStartConversation`)
  - Constants: UPPER_SNAKE_CASE (e.g., `API_PROVIDERS`)
  - Types/Interfaces: PascalCase (e.g., `AgentConfig`, `ConversationState`)

## File Organization
```
src/
├── components/          # React components (PascalCase.tsx)
├── services/           # Business logic and API clients  
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # React entry point
└── index.css           # Global styles
```

## React Patterns
- Functional components with hooks (useState, useEffect, useCallback, useRef)
- Custom hooks for complex state logic
- Props destructuring in component parameters
- TypeScript interfaces for all component props
- Use of React.StrictMode in development

## State Management
- useState for local component state
- useRef for mutable values that don't trigger re-renders
- Custom AgentManager service class for business logic
- Electron-store for persistent encrypted storage

## Styling
- **CSS Framework**: Tailwind CSS 3 with utility classes
- **Theme**: Dark mode primary (`bg-dark-900`, `text-gray-100`)
- **Component Classes**: Utility-first approach with Tailwind
- **Icons**: Lucide React icon library

## API Integration
- Async/await pattern for API calls
- Proper error handling with try/catch blocks
- Type-safe API client interfaces
- Secure API key storage using electron-store encryption

## Security Practices
- Context isolation enabled in Electron
- Secure IPC communication via preload script
- Encrypted storage for sensitive data (API keys)
- No hardcoded secrets or API keys in code
- Sandbox mode for web content security