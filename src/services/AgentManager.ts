import { APIClient } from './APIClient'
import { type AgentConfig, type Message, MessageRole, APIProvider } from '../types'

export class AgentManager {
  private apiClient: APIClient

  constructor() {
    this.apiClient = new APIClient()
  }

  async getResponse(agent: AgentConfig, conversationMessages: Message[]): Promise<string> {
    try {
      // Prepare messages for the API call
      const messages = this.prepareMessages(agent, conversationMessages)

      // Prepare additional parameters
      const additionalParams: any = {}
      
      if (agent.presencePenalty !== undefined) {
        additionalParams.presence_penalty = agent.presencePenalty
      }
      
      if (agent.frequencyPenalty !== undefined) {
        additionalParams.frequency_penalty = agent.frequencyPenalty
      }
      
      if (agent.topP !== undefined) {
        additionalParams.top_p = agent.topP
      }
      
      if (agent.topK !== undefined) {
        additionalParams.top_k = agent.topK
      }
      
      if (agent.reasoningEffort) {
        // This would be handled differently per provider
        // For now, we'll include it in the additional params
        additionalParams.reasoning_effort = agent.reasoningEffort
      }
      
      // Add local server configuration for local providers
      if (agent.localServerConfig) {
        additionalParams.localServerConfig = agent.localServerConfig
      }

      // Make API call
      const response = await this.apiClient.sendMessage(
        agent.provider,
        messages,
        agent.model,
        agent.maxTokens,
        agent.temperature,
        additionalParams
      )

      if (!response.success) {
        throw new Error(response.error || 'Failed to get response from API')
      }

      return response.data.content
    } catch (error) {
      console.error(`Error getting response for ${agent.name}:`, error)
      throw error
    }
  }

  private prepareMessages(agent: AgentConfig, conversationMessages: Message[]): Message[] {
    const messages: Message[] = []

    // Add system message with agent persona
    messages.push({
      id: 'system',
      role: MessageRole.SYSTEM,
      content: agent.persona,
      timestamp: new Date()
    })

    // Add conversation context
    // Filter to include system messages and recent conversation messages
    const contextMessages = conversationMessages.slice(-10) // Keep last 10 messages for context
    
    const conversationParts: Message[] = []
    
    for (const msg of contextMessages) {
      if (msg.role === MessageRole.SYSTEM && msg.id !== 'system') {
        // Include other system messages but not the persona
        messages.push(msg)
      } else if (msg.role === MessageRole.OPERATOR) {
        // Operator messages are only visible to Agent 1
        // They appear as user messages but with special handling
        if (agent.id === 'agent1') {
          conversationParts.push({
            ...msg,
            role: MessageRole.USER,
            content: `[OPERATOR MESSAGE]: ${msg.content}`
          })
        }
        // Agent 2 doesn't see operator messages at all
      } else if (msg.agentId === agent.id) {
        // This agent's previous messages become assistant messages
        conversationParts.push({
          ...msg,
          role: MessageRole.ASSISTANT
        })
      } else {
        // Other agent's messages become user messages
        conversationParts.push({
          ...msg,
          role: MessageRole.USER
        })
      }
    }

    // For local providers (Llama.cpp, Ollama), ensure roles alternate properly
    // Provider check for local servers
    if (agent.provider === APIProvider.LLAMACPP || agent.provider === APIProvider.OLLAMA) {
      console.log('Applying role alternation fix for local provider')
      const fixedParts = this.fixRoleAlternation(conversationParts)
      messages.push(...fixedParts)
    } else {
      console.log('Using standard message handling')
      messages.push(...conversationParts)
    }

    return messages
  }

  private fixRoleAlternation(messages: Message[]): Message[] {
    if (messages.length === 0) return messages

    const fixed: Message[] = []
    let lastRole: MessageRole | null = null

    for (const msg of messages) {
      if (msg.role === lastRole) {
        // If same role as previous, merge the messages
        if (fixed.length > 0) {
          fixed[fixed.length - 1].content += '\n\n' + msg.content
        } else {
          fixed.push(msg)
        }
      } else {
        fixed.push(msg)
        lastRole = msg.role
      }
    }

    // Ensure it starts with a user message for proper alternation
    if (fixed.length > 0 && fixed[0].role === MessageRole.ASSISTANT) {
      fixed.unshift({
        id: 'initial-user',
        role: MessageRole.USER,
        content: 'Hello, let\'s start our conversation.',
        timestamp: new Date()
      })
    }

    return fixed
  }

  async testAgentConnection(agent: AgentConfig): Promise<boolean> {
    try {
      return await this.apiClient.testConnection(agent.provider)
    } catch {
      return false
    }
  }

  async getAvailableModels(provider: APIProvider): Promise<string[]> {
    return await this.apiClient.fetchModelsForProvider(provider)
  }

  getDefaultModel(provider: APIProvider): string {
    return this.apiClient.getDefaultModel(provider)
  }

  async saveAPIKey(provider: string, key: string): Promise<boolean> {
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.storeApiKey(provider, key)
        return result.success
      } catch {
        return false
      }
    }
    return false
  }

  async getAPIKey(provider: string): Promise<string | null> {
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.getApiKey(provider)
        return result.success && result.key ? result.key : null
      } catch {
        return null
      }
    }
    return null
  }

  async deleteAPIKey(provider: string): Promise<boolean> {
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.deleteApiKey(provider)
        return result.success
      } catch {
        return false
      }
    }
    return false
  }

  // Utility method to generate conversation summary
  generateConversationSummary(messages: Message[]): string {
    const nonSystemMessages = messages.filter(m => m.role !== MessageRole.SYSTEM && m.role !== MessageRole.OPERATOR)
    
    if (nonSystemMessages.length === 0) {
      return 'Empty conversation'
    }

    const firstMessage = nonSystemMessages[0]
    const summary = firstMessage.content.substring(0, 100)
    
    return summary.length < firstMessage.content.length 
      ? `${summary}...` 
      : summary
  }

  // Method to export conversation as markdown
  exportConversationAsMarkdown(
    messages: Message[],
    agent1Name: string,
    agent2Name: string,
    title: string = 'AgentCHAT Conversation'
  ): string {
    const lines = [
      `# ${title}`,
      '',
      `**Generated:** ${new Date().toLocaleString()}`,
      '',
      '## Conversation',
      ''
    ]

    messages.forEach(msg => {
      if (msg.role === MessageRole.SYSTEM) {
        lines.push(`**System:** ${msg.content}`)
      } else if (msg.role === MessageRole.OPERATOR) {
        lines.push(`**[Operator Injection]:** ${msg.content}`)
      } else if (msg.role === MessageRole.USER && !msg.agentId) {
        // This is the initial prompt
        const timestamp = msg.timestamp.toLocaleTimeString()
        lines.push(`**Initial Prompt** *(${timestamp})*: ${msg.content}`)
      } else {
        const agentName = msg.agentId?.includes('1') ? agent1Name : agent2Name
        const timestamp = msg.timestamp.toLocaleTimeString()
        lines.push(`**${agentName}** *(${timestamp})*: ${msg.content}`)
      }
      lines.push('')
    })

    return lines.join('\n')
  }
}