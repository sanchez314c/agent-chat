/**
 * Application constants
 */

// Application metadata
export const APP_NAME = 'AgentCHAT';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Multi-agent AI conversation desktop application';

// Default conversation settings
export const DEFAULT_SETTINGS = {
  temperature: 0.7,
  maxTokens: 2000,
  topP: 1.0,
  topK: 40,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
};

// AI Provider constants
export const AI_PROVIDERS = {
  CLAUDE: 'claude',
  OPENAI: 'openai',
  GEMINI: 'gemini',
  OPENROUTER: 'openrouter',
  OLLAMA: 'ollama',
  LM_STUDIO: 'lm_studio',
  DEEPSEEK: 'deepseek',
  GROQ: 'groq',
  HUGGINGFACE: 'huggingface',
  XAI: 'xai',
  TOGETHER: 'together',
  MISTRAL: 'mistral',
  COHERE: 'cohere',
  PERPLEXITY: 'perplexity',
  LOCALAI: 'localai',
} as const;

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AGENT_CONFIG: 'agent-config',
  API_KEYS: 'api-keys',
  CONVERSATIONS: 'conversations',
  SETTINGS: 'settings',
  THEME: 'theme',
  WINDOW_STATE: 'window-state',
} as const;

// UI constants
export const UI_CONSTANTS = {
  MAX_CONVERSATION_LENGTH: 100,
  MAX_MESSAGE_LENGTH: 50000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  SIDEBAR_WIDTH: 300,
  MIN_WINDOW_WIDTH: 800,
  MIN_WINDOW_HEIGHT: 600,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'API key is required',
  NETWORK_ERROR: 'Network connection failed',
  INVALID_RESPONSE: 'Invalid response from AI provider',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  TOKEN_LIMIT_EXCEEDED: 'Token limit exceeded',
  INVALID_MODEL: 'Invalid model selected',
  CONFIGURATION_ERROR: 'Configuration error',
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
  API_KEY: /^[a-zA-Z0-9_-]{20,}$/,
  AGENT_NAME: /^[a-zA-Z0-9\s_-]{1,50}$/,
  CONVERSATION_TITLE: /^[a-zA-Z0-9\s_-]{1,100}$/,
} as const;