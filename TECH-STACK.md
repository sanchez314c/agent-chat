# Tech Stack for AgentCHAT

## Overview
AgentCHAT is a desktop application for multi-agent AI conversations, built as an Electron app with a React frontend.

## Technology Stack

### Core Framework
- **Electron 25.3.1** - Cross-platform desktop application framework
  - Main process: Node.js environment
  - Renderer process: Chromium browser environment
  - Preload scripts for secure IPC communication

### Frontend
- **React 18.2.0** - UI library with functional components and hooks
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite 4.4.5** - Fast build tool and development server

### Styling
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **PostCSS** - CSS processing with autoprefixer
- **Lucide React** - Icon library for UI components

### State Management & Storage
- **Electron Store 8.1.0** - Encrypted secure storage for API keys and settings
- **React Hooks** - Local state management

### Build & Packaging
- **Electron Builder 24.6.3** - Cross-platform build tool
- **TypeScript Compiler** - Compilation to JavaScript
- **Vite Build** - Frontend bundling and optimization

### Dependencies
- **clsx 2.0.0** - Utility for conditional CSS classes
- **Cross-env 7.0.3** - Cross-platform environment variables
- **Concurrently 8.2.0** - Run multiple commands simultaneously

### Development Tools
- **ESLint** - Code linting with TypeScript support
- **Vite Dev Server** - Hot reload development environment
- **Electron DevTools** - Debugging and inspection

## Architecture
- **Main Process**: Handles system-level operations (src/main.cjs)
- **Renderer Process**: React application running in Chromium (src/App.tsx)
- **Preload Script**: Secure bridge between main and renderer (src/preload.cjs)
- **IPC Communication**: Secure inter-process communication

## Supported Platforms
- **macOS**: Intel (x64) and Apple Silicon (ARM64)
- **Windows**: x64 and x86
- **Linux**: x64

## Build Outputs
- **macOS**: .app bundle and .dmg installer
- **Windows**: .exe installer and portable .zip
- **Linux**: .AppImage, .deb, .rpm packages

## Security Features
- Context isolation enabled
- Secure API key storage with encryption
- Sandboxed renderer process

## AI Integration
Supports multiple AI providers:
- Anthropic Claude (3.5 Sonnet, 3 Opus, 3 Haiku)
- OpenAI GPT (GPT-4, GPT-4 Turbo, GPT-3.5 Turbo)
- Google Gemini (1.5 Pro, 1.5 Flash)
- OpenRouter (Llama, Mixtral, open-source models)