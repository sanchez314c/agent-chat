import React, { useState, useEffect, useCallback, useRef } from 'react'
import { APIProvider, ConversationState, type Conversation, type AgentConfig, type Message, MessageRole } from './types'
import { AgentManager } from './services/AgentManager'
import { API_PROVIDERS } from './services/APIClient'
import { ConversationPanel } from './components/ConversationPanel'
import { AgentConfigPanel } from './components/AgentConfigPanel'
import { StatusBar } from './components/StatusBar'
import { APIKeyModal } from './components/APIKeyModal'
import { ErrorBoundary } from './components/ErrorBoundary'

const defaultAgent1: AgentConfig = {
  id: 'agent1',
  name: 'Agent 1',
  provider: APIProvider.OPENROUTER,
  model: 'meta-llama/llama-3.1-8b-instruct:free',
  persona: 'You are a helpful, creative, and intelligent AI assistant. Engage in thoughtful conversation and provide detailed, well-reasoned responses.',
  temperature: 0.7,
  maxTokens: 1000,
  presencePenalty: 0,
  frequencyPenalty: 0,
  topP: 1.0,
  topK: 40
}

const defaultAgent2: AgentConfig = {
  id: 'agent2',
  name: 'Agent 2',
  provider: APIProvider.OPENROUTER,
  model: 'meta-llama/llama-3.1-8b-instruct:free',
  persona: 'You are an analytical and detail-oriented AI assistant. Focus on logic, accuracy, and providing comprehensive analysis of topics.',
  temperature: 0.5,
  maxTokens: 1000,
  presencePenalty: 0,
  frequencyPenalty: 0,
  topP: 1.0,
  topK: 40
}

function App() {
  const [agentManager] = useState(() => new AgentManager())
  const [agent1, setAgent1] = useState<AgentConfig>(defaultAgent1)
  const [agent2, setAgent2] = useState<AgentConfig>(defaultAgent2)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [conversationState, setConversationStateBase] = useState<ConversationState>(ConversationState.IDLE)
  const conversationStateRef = useRef<ConversationState>(ConversationState.IDLE)

  // [H10] Refs for agent configs so the conversation loop always reads current values
  const agent1Ref = useRef<AgentConfig>(agent1)
  const agent2Ref = useRef<AgentConfig>(agent2)
  agent1Ref.current = agent1
  agent2Ref.current = agent2

  // [C2] Ref that always holds the latest conversation state for the loop to merge from
  const conversationRef = useRef<Conversation | null>(null)

  // [H9] Ref for timeout ID so we can clear it on unmount
  const loopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // [H9/H11] Ref to track if a conversation loop is actively running
  const isLoopRunningRef = useRef<boolean>(false)

  // Wrapper to update both state and ref
  const setConversationState = (newState: ConversationState) => {
    conversationStateRef.current = newState
    setConversationStateBase(newState)
  }

  // [C2] Keep conversationRef in sync with conversation state
  useEffect(() => {
    conversationRef.current = conversation
  }, [conversation])
  const [systemPrompt, setSystemPrompt] = useState('You are participating in a conversation between two AI agents. Stay in character and engage naturally with the other agent.')
  const [initialPrompt, setInitialPrompt] = useState('Hello! Let\'s have an interesting conversation about artificial intelligence and its potential impact on society.')
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<APIProvider>(APIProvider.OPENROUTER)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [currentTurn, setCurrentTurn] = useState(0)
  const [maxTurns, setMaxTurns] = useState(10)
  const [showAbout, setShowAbout] = useState(false)

  // [C9] Refs for values used in the initial useEffect to avoid stale closure
  const agent1InitRef = useRef(agent1)
  const agent2InitRef = useRef(agent2)
  const systemPromptInitRef = useRef(systemPrompt)
  const initialPromptInitRef = useRef(initialPrompt)

  // Initialize conversation
  useEffect(() => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      agents: [agent1InitRef.current, agent2InitRef.current],
      systemPrompt: systemPromptInitRef.current,
      initialPrompt: initialPromptInitRef.current
    }
    setConversation(newConversation)
  }, []) // Initial setup only - reads from refs to get current values

  // [H9] Cleanup timeout and mark loop stopped on unmount
  useEffect(() => {
    return () => {
      if (loopTimeoutRef.current !== null) {
        clearTimeout(loopTimeoutRef.current)
        loopTimeoutRef.current = null
      }
      isLoopRunningRef.current = false
    }
  }, [])

  // Close About modal on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAbout(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      agents: [agent1, agent2],
      systemPrompt,
      initialPrompt
    }
    setConversation(newConversation)
    setConversationState(ConversationState.IDLE)
    setErrorMessage(undefined)
    setCurrentTurn(0)
  }, [agent1, agent2, systemPrompt, initialPrompt])

  const handleSaveConversation = useCallback(async () => {
    if (!conversation || conversation.messages.length === 0) return

    const markdown = agentManager.exportConversationAsMarkdown(
      conversation.messages,
      agent1.name,
      agent2.name,
      conversation.title
    )

    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.saveConversation(markdown)
        if (result.success && !result.cancelled) {
          console.log('Conversation saved to:', result.filePath)
        }
      } catch (error) {
        console.error('Failed to save conversation:', error)
      }
    }
  }, [conversation, agent1.name, agent2.name, agentManager])

  // [L16] Handle Electron menu events with proper cleanup
  useEffect(() => {
    if (window.electronAPI) {
      const cleanupNew = window.electronAPI.onMenuNewConversation(() => {
        handleNewConversation()
      })

      const cleanupSave = window.electronAPI.onMenuSaveConversation(() => {
        handleSaveConversation()
      })

      return () => {
        // Use returned cleanup functions if available, otherwise use removeMenuListeners
        if (typeof cleanupNew === 'function') cleanupNew()
        if (typeof cleanupSave === 'function') cleanupSave()
        if (window.electronAPI?.removeMenuListeners) {
          window.electronAPI.removeMenuListeners()
        }
      }
    }
  }, [handleNewConversation, handleSaveConversation])

  const handleStartConversation = async () => {
    if (!conversation) return

    // Check if API keys are configured for providers that require them
    try {
      const agent1RequiresKey = API_PROVIDERS[agent1.provider]?.requiresAuth
      const agent2RequiresKey = API_PROVIDERS[agent2.provider]?.requiresAuth

      if (agent1RequiresKey) {
        const agent1HasKey = await agentManager.getAPIKey(agent1.provider)
        if (!agent1HasKey) {
          setErrorMessage(`Please configure API key for ${agent1.name} (${agent1.provider})`)
          handleConfigureAPIKey(agent1.provider)
          return
        }
      }

      if (agent2RequiresKey) {
        const agent2HasKey = await agentManager.getAPIKey(agent2.provider)
        if (!agent2HasKey) {
          setErrorMessage(`Please configure API key for ${agent2.name} (${agent2.provider})`)
          handleConfigureAPIKey(agent2.provider)
          return
        }
      }
    } catch (error) {
      setErrorMessage('Failed to check API keys. Please configure them in the agent settings.')
      return
    }

    setConversationState(ConversationState.RUNNING)
    setErrorMessage(undefined)
    setCurrentTurn(0)

    try {
      // Add system message
      const systemMessage: Message = {
        id: crypto.randomUUID(),
        role: MessageRole.SYSTEM,
        content: systemPrompt,
        timestamp: new Date()
      }

      // Add initial prompt as a user message (to be delivered to Agent 1)
      const initialMessage: Message = {
        id: crypto.randomUUID(),
        role: MessageRole.USER,
        content: initialPrompt,
        timestamp: new Date()
        // No agentId - this is the initial prompt TO Agent 1, not FROM anyone
      }

      const updatedConversation = {
        ...conversation,
        messages: [systemMessage, initialMessage],
        updatedAt: new Date()
      }

      setConversation(updatedConversation)

      // Start the conversation loop
      await runConversationLoop(updatedConversation, 0, maxTurns)
    } catch (error) {
      setConversationState(ConversationState.ERROR)
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const runConversationLoop = async (initialConv: Conversation, turnCount: number, maxTurns: number) => {
    let conv = initialConv
    console.log('runConversationLoop called:', { turnCount, maxTurns, state: conversationStateRef.current })

    // [H11] Mark loop as running
    isLoopRunningRef.current = true

    // Check if we should stop
    if (turnCount >= maxTurns) {
      console.log('Max turns reached, stopping')
      setConversationState(ConversationState.IDLE)
      isLoopRunningRef.current = false
      return
    }

    // Check current state from ref
    if (conversationStateRef.current !== ConversationState.RUNNING) {
      console.log('State is not RUNNING, stopping:', conversationStateRef.current)
      isLoopRunningRef.current = false
      return
    }

    setCurrentTurn(turnCount)

    // [C2] Merge any new messages (e.g. operator injections) from conversationRef into loop's conv
    const latestConv = conversationRef.current
    if (latestConv && latestConv.messages.length > conv.messages.length) {
      const newMessages = latestConv.messages.slice(conv.messages.length)
      conv = {
        ...conv,
        messages: [...conv.messages, ...newMessages],
        updatedAt: new Date()
      }
    }

    try {
      // [H10] Read agent configs from refs to get current values, not stale closure
      const currentAgent1 = agent1Ref.current
      const currentAgent2 = agent2Ref.current

      // Determine which agent should respond
      // Turn 0: Agent 1 responds to initial prompt
      // Turn 1: Agent 2 responds to Agent 1
      // Turn 2: Agent 1 responds to Agent 2, etc.
      const respondingAgent = turnCount % 2 === 0 ? currentAgent1 : currentAgent2

      // Get response from agent
      console.log('Getting response from agent:', respondingAgent.name, 'with model:', respondingAgent.model)
      const response = await agentManager.getResponse(respondingAgent, conv.messages)

      // [H9] Check cancellation after async operation
      if (!isLoopRunningRef.current || conversationStateRef.current !== ConversationState.RUNNING) {
        console.log('Loop cancelled during API call, stopping')
        isLoopRunningRef.current = false
        return
      }

      const responseMessage: Message = {
        id: crypto.randomUUID(),
        role: MessageRole.ASSISTANT,
        content: response,
        timestamp: new Date(),
        agentId: respondingAgent.id,
        provider: respondingAgent.provider,
        model: respondingAgent.model
      }

      const updatedConversation = {
        ...conv,
        messages: [...conv.messages, responseMessage],
        updatedAt: new Date()
      }

      setConversation(updatedConversation)

      // [H9] Continue the conversation after a short delay, storing timeout ID for cleanup
      loopTimeoutRef.current = setTimeout(() => {
        loopTimeoutRef.current = null
        console.log('In setTimeout - checking state:', conversationStateRef.current, 'turnCount:', turnCount + 1)
        if (conversationStateRef.current === ConversationState.RUNNING && isLoopRunningRef.current) {
          console.log('Continuing conversation loop...')
          runConversationLoop(updatedConversation, turnCount + 1, maxTurns)
        } else {
          console.log('NOT continuing - state is:', conversationStateRef.current)
          isLoopRunningRef.current = false
        }
      }, 2000)

    } catch (error) {
      isLoopRunningRef.current = false
      setConversationState(ConversationState.ERROR)
      let errorMsg = 'Failed to get agent response'

      if (error instanceof Error) {
        if (error.message.includes('No API key found')) {
          errorMsg = error.message + '. Please configure it in the agent settings.'
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMsg = 'Invalid API key. Please check your API key configuration.'
        } else if (error.message.includes('429')) {
          errorMsg = 'Rate limit exceeded. Please wait a moment and try again.'
        } else {
          errorMsg = error.message
        }
      }

      setErrorMessage(errorMsg)
    }
  }

  const handleStopConversation = () => {
    // [H9] Clear pending timeout and stop loop
    if (loopTimeoutRef.current !== null) {
      clearTimeout(loopTimeoutRef.current)
      loopTimeoutRef.current = null
    }
    isLoopRunningRef.current = false
    setConversationState(ConversationState.IDLE)
  }

  const handlePauseConversation = () => {
    // [H9] Clear pending timeout and stop loop
    if (loopTimeoutRef.current !== null) {
      clearTimeout(loopTimeoutRef.current)
      loopTimeoutRef.current = null
    }
    isLoopRunningRef.current = false
    setConversationState(ConversationState.PAUSED)
  }

  const handleResumeConversation = () => {
    // [H11] Check isLoopRunningRef to prevent duplicate loops from rapid resume calls
    if (conversation && conversationState === ConversationState.PAUSED && !isLoopRunningRef.current) {
      setConversationState(ConversationState.RUNNING)
      runConversationLoop(conversation, currentTurn, maxTurns)
    }
  }

  const handleInjectOperatorMessage = (message: string) => {
    // [C3] Allow injection when RUNNING or PAUSED (operator may want to inject before resuming)
    if (conversationState !== ConversationState.RUNNING && conversationState !== ConversationState.PAUSED) return

    // Add operator message to conversation
    const operatorMessage: Message = {
      id: crypto.randomUUID(),
      role: MessageRole.OPERATOR,
      content: message,
      timestamp: new Date(),
      isOperatorMessage: true
    }

    // [M16] Use functional state update to avoid lost-update race condition
    setConversation(prev => {
      if (!prev) return prev
      return {
        ...prev,
        messages: [...prev.messages, operatorMessage],
        updatedAt: new Date()
      }
    })

    // The message will be picked up by Agent 1 in the next turn
    console.log('Injected operator message:', message)
  }

  const handleConfigureAPIKey = (provider: APIProvider) => {
    setSelectedProvider(provider)
    setShowAPIKeyModal(true)
  }

  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Drag Handle */}
        <div className="drag-handle" />

        {/* Title Bar */}
        <div className="title-bar">
          <img src={new URL('./icon-titlebar.png', import.meta.url).href} className="app-icon" alt="" draggable={false} />
          <span className="app-name">AgentCHAT</span>
          <span className="app-tagline">Multi-Agent AI Conversation</span>
          <div className="spacer" />
          <div className="title-bar-controls">
            <div className="title-bar-actions">
              <button className="title-bar-action about-btn" title="About" onClick={() => setShowAbout(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </button>
            </div>
            <div className="title-bar-window-controls">
              <button className="window-ctrl-btn" onClick={() => window.electronAPI?.windowMinimize()} title="Minimize">&#x2500;</button>
              <button className="window-ctrl-btn" onClick={() => window.electronAPI?.windowMaximize()} title="Maximize">&#x25A1;</button>
              <button className="window-ctrl-btn window-close-btn" onClick={() => window.electronAPI?.windowClose()} title="Close">&#x2715;</button>
            </div>
          </div>
        </div>

        {/* App Body */}
        <div className="app-body">
          {/* Left Panel - Agent Configuration */}
          <div className="w-[420px] flex-shrink-0">
            <div className="neo-panel h-full overflow-hidden flex flex-col">
              <AgentConfigPanel
                agent1={agent1}
                agent2={agent2}
                systemPrompt={systemPrompt}
                initialPrompt={initialPrompt}
                onAgent1Change={setAgent1}
                onAgent2Change={setAgent2}
                onSystemPromptChange={setSystemPrompt}
                onInitialPromptChange={setInitialPrompt}
                onConfigureAPIKey={handleConfigureAPIKey}
                onInjectOperatorMessage={handleInjectOperatorMessage}
                conversationState={conversationState}
              />
            </div>
          </div>

          {/* Right Panel - Conversation */}
          <div className="flex-1 min-w-0">
            <div className="neo-panel h-full overflow-hidden flex flex-col">
              <ConversationPanel
                conversation={conversation}
                conversationState={conversationState}
                errorMessage={errorMessage}
                onStart={handleStartConversation}
                onStop={handleStopConversation}
                onPause={handlePauseConversation}
                onResume={handleResumeConversation}
                onNew={handleNewConversation}
                onSave={handleSaveConversation}
              />
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar
          conversationState={conversationState}
          messageCount={conversation?.messages.length || 0}
          errorMessage={errorMessage}
        />

        {/* API Key Modal */}
        {showAPIKeyModal && (
          <APIKeyModal
            provider={selectedProvider}
            onClose={() => setShowAPIKeyModal(false)}
            onSave={() => setShowAPIKeyModal(false)}
          />
        )}

        {/* About Modal */}
        {showAbout && (
          <div className="about-overlay active" onClick={(e) => { if (e.target === e.currentTarget) setShowAbout(false) }}>
            <div className="about-modal">
              <button className="about-close-btn" onClick={() => setShowAbout(false)}>&#x2715;</button>
              <img src={new URL('./icon-titlebar.png', import.meta.url).href} className="about-app-icon" alt="" />
              <h2 className="about-app-name">AgentCHAT</h2>
              <div className="about-version">v1.0.0</div>
              <div className="about-desc">Multi-Agent AI Conversation Desktop App</div>
              <div className="about-license">MIT License | Jason Paul Michaels</div>
              <button className="about-github-badge" onClick={() => {
                if (window.electronAPI?.openExternal) {
                  window.electronAPI.openExternal('https://github.com/sanchez314c/agent-chat')
                }
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                GitHub
              </button>
              <div className="about-email">software@jasonpaulmichaels.co</div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
