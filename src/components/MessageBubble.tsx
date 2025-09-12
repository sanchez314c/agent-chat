import React from 'react'
import { Bot, User, UserCog } from 'lucide-react'
import { type Message, MessageRole } from '../types'

interface MessageBubbleProps {
  message: Message
  isAgent1: boolean
  agentName: string
}

export function MessageBubble({ message, isAgent1, agentName }: MessageBubbleProps) {
  // Handle operator messages specially
  if (message.role === MessageRole.OPERATOR) {
    return (
      <div className="flex justify-center">
        <div className="max-w-[80%]">
          {/* Operator Header */}
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
              <UserCog className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-purple-400">Operator Injection</span>
            <span className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
          
          {/* Message Content */}
          <div className="card bg-purple-900/30 border-purple-700/50 rounded">
            <div className="text-sm leading-relaxed whitespace-pre-wrap italic">
              {message.content}
            </div>
            <div className="mt-2 text-xs text-purple-400">
              This message was injected to steer the conversation
            </div>
          </div>
        </div>
      </div>
    )
  }

  const agentColor = isAgent1 ? 'agent1' : 'agent2'
  const bubbleColor = isAgent1 
    ? 'bg-green-900/30 border-green-700/50' 
    : 'bg-blue-900/30 border-blue-700/50'
  
  const iconColor = isAgent1 ? 'text-agent1' : 'text-agent2'
  
  return (
    <div className={`flex ${isAgent1 ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] ${isAgent1 ? 'ml-0' : 'mr-0'}`}>
        {/* Agent Header */}
        <div className={`flex items-center space-x-2 mb-2 ${isAgent1 ? 'justify-start' : 'justify-end'}`}>
          {isAgent1 && (
            <>
              <div className={`w-6 h-6 rounded-full bg-green-600 flex items-center justify-center ${iconColor}`}>
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-agent1">{agentName}</span>
            </>
          )}
          {!isAgent1 && (
            <>
              <span className="text-sm font-medium text-agent2">{agentName}</span>
              <div className={`w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center ${iconColor}`}>
                <Bot className="w-4 h-4" />
              </div>
            </>
          )}
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        {/* Message Content */}
        <div className={`card ${bubbleColor} ${isAgent1 ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
          
          {/* Message Metadata */}
          {(message.provider || message.model) && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-600">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                {message.provider && (
                  <span className="bg-dark-700 px-2 py-1 rounded capitalize">
                    {message.provider}
                  </span>
                )}
                {message.model && (
                  <span className="bg-dark-700 px-2 py-1 rounded font-mono">
                    {message.model}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}