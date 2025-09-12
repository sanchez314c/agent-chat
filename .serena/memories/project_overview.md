# AgentCHAT Project Overview

## Purpose
AgentCHAT is a multi-agent AI conversation desktop application built with Electron, React, and TypeScript. It allows users to set up conversations between two AI agents from different providers (Claude, GPT-4, Gemini, OpenRouter) and watch them interact with each other in real-time.

## Key Features
- Multi-agent conversations between different AI providers
- Secure encrypted storage of API keys using electron-store
- Real-time conversation streaming and display
- Export conversations as Markdown files
- Cross-platform desktop app (Windows, macOS, Linux)
- Modern dark-themed UI with Tailwind CSS
- Agent configuration with customizable personas and parameters

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Desktop Framework**: Electron 25 with secure IPC
- **Build Tools**: Vite 4, electron-builder
- **Storage**: electron-store with encryption
- **Icons**: Lucide React
- **Bundler**: Vite with React plugin
- **Code Quality**: ESLint with TypeScript rules

## Architecture
- Electron main process handles secure storage, file operations, and IPC
- React frontend provides the user interface
- Agent Manager service handles AI provider API calls
- Secure preload script bridges main and renderer processes
- Encrypted configuration storage for sensitive data like API keys