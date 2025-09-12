import React, { useState, useEffect, useCallback, useRef } from 'react'
import { APIProvider, ConversationState, type Conversation, type AgentConfig, type Message, MessageRole } from './types'
import { AgentManager } from './services/AgentManager'
import { API_PROVIDERS } from './services/APIClient'
import { ConversationPanel } from './components/ConversationPanel'
import { AgentConfigPanel } from './components/AgentConfigPanel'
import { StatusBar } from './components/StatusBar'
import { APIKeyModal } from './components/APIKeyModal'

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
  
  // Wrapper to update both state and ref
  const setConversationState = (newState: ConversationState) => {
    conversationStateRef.current = newState
    setConversationStateBase(newState)
  }
  const [systemPrompt, setSystemPrompt] = useState('You are participating in a conversation between two AI agents. Stay in character and engage naturally with the other agent.')
  const [initialPrompt, setInitialPrompt] = useState('Hello! Let\'s have an interesting conversation about artificial intelligence and its potential impact on society.')
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<APIProvider>(APIProvider.OPENROUTER)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [currentTurn, setCurrentTurn] = useState(0)
  const [maxTurns, setMaxTurns] = useState(10)

  // Initialize conversation
  useEffect(() => {
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
  }, []) // Initial setup only, agents are updated via setters

  // Handle Electron menu events (moved after handlers definition)

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

  // Handle Electron menu events
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onMenuNewConversation(() => {
        handleNewConversation()
      })

      window.electronAPI.onMenuSaveConversation(() => {
        handleSaveConversation()
      })
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

  const runConversationLoop = async (conv: Conversation, turnCount: number, maxTurns: number) => {
    console.log('runConversationLoop called:', { turnCount, maxTurns, state: conversationStateRef.current })
    
    // Check if we should stop
    if (turnCount >= maxTurns) {
      console.log('Max turns reached, stopping')
      setConversationState(ConversationState.IDLE)
      return
    }
    
    // Check current state from ref
    if (conversationStateRef.current !== ConversationState.RUNNING) {
      console.log('State is not RUNNING, stopping:', conversationStateRef.current)
      return
    }

    setCurrentTurn(turnCount)

    try {
      // Determine which agent should respond
      // Turn 0: Agent 1 responds to initial prompt
      // Turn 1: Agent 2 responds to Agent 1
      // Turn 2: Agent 1 responds to Agent 2, etc.
      const respondingAgent = turnCount % 2 === 0 ? agent1 : agent2
      const isAgent1Turn = respondingAgent.id === agent1.id
      
      // Get response from agent
      console.log('Getting response from agent:', respondingAgent.name, 'with model:', respondingAgent.model)
      const response = await agentManager.getResponse(respondingAgent, conv.messages)

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

      // Continue the conversation after a short delay
      setTimeout(() => {
        console.log('In setTimeout - checking state:', conversationStateRef.current, 'turnCount:', turnCount + 1)
        if (conversationStateRef.current === ConversationState.RUNNING) {
          console.log('Continuing conversation loop...')
          runConversationLoop(updatedConversation, turnCount + 1, maxTurns)
        } else {
          console.log('NOT continuing - state is:', conversationStateRef.current)
        }
      }, 2000)

    } catch (error) {
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
    setConversationState(ConversationState.IDLE)
  }

  const handlePauseConversation = () => {
    setConversationState(ConversationState.PAUSED)
  }

  const handleResumeConversation = () => {
    if (conversation && conversationState === ConversationState.PAUSED) {
      setConversationState(ConversationState.RUNNING)
      runConversationLoop(conversation, currentTurn, maxTurns)
    }
  }

  const handleInjectOperatorMessage = (message: string) => {
    if (!conversation || conversationState !== ConversationState.RUNNING) return

    // Add operator message to conversation
    const operatorMessage: Message = {
      id: crypto.randomUUID(),
      role: MessageRole.OPERATOR,
      content: message,
      timestamp: new Date(),
      isOperatorMessage: true
    }

    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, operatorMessage],
      updatedAt: new Date()
    }

    setConversation(updatedConversation)
    
    // The message will be picked up by Agent 1 in the next turn
    console.log('Injected operator message:', message)
  }

  const handleConfigureAPIKey = (provider: APIProvider) => {
    setSelectedProvider(provider)
    setShowAPIKeyModal(true)
  }

  return (
    <div className="h-screen flex flex-col bg-dark-900 text-gray-100">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Agent Configuration */}
        <div className="w-96 border-r border-dark-700 flex flex-col">
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

        {/* Right Panel - Conversation */}
        <div className="flex-1 flex flex-col">
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
    </div>
  )
}

export default App