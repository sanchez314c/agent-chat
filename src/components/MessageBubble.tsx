import React from 'react'
import { Bot, UserCog } from 'lucide-react'
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
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-7 h-7 rounded-neo bg-neon-500/20 flex items-center justify-center" style={{ boxShadow: '0 0 12px rgba(139, 92, 246, 0.3)' }}>
              <UserCog className="w-4 h-4 text-neon-400" />
            </div>
            <span className="text-sm font-medium text-neon-400">Operator Injection</span>
            <span className="text-xs text-white/30">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {/* Message Content */}
          <div className="message-bubble message-bubble-operator rounded-neo">
            <div className="text-sm leading-relaxed whitespace-pre-wrap italic text-white/80">
              {message.content}
            </div>
            <div className="mt-3 pt-3 border-t border-neon-500/20 text-xs text-neon-400/70">
              This message was injected to steer the conversation
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Handle initial user message (before agents respond)
  if (message.role === MessageRole.USER) {
    return (
      <div className="flex justify-center">
        <div className="max-w-[80%]">
          {/* Initial Prompt Header */}
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-7 h-7 rounded-neo bg-cyber-400/20 flex items-center justify-center" style={{ boxShadow: '0 0 12px rgba(20, 184, 166, 0.3)' }}>
              <Bot className="w-4 h-4 text-cyber-400" />
            </div>
            <span className="text-sm font-medium text-cyber-400">Initial Prompt</span>
            <span className="text-xs text-white/30">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {/* Message Content */}
          <div className="neo-card-glow rounded-neo">
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-white/90">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const bubbleClass = isAgent1 ? 'message-bubble-agent1' : 'message-bubble-agent2'
  const accentColor = isAgent1 ? '#10b981' : '#06b6d4'
  const textColor = isAgent1 ? 'text-agent1' : 'text-agent2'
  const bgColor = isAgent1 ? 'bg-agent1/20' : 'bg-agent2/20'

  return (
    <div className={`flex ${isAgent1 ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] ${isAgent1 ? 'ml-0' : 'mr-0'}`}>
        {/* Agent Header */}
        <div className={`flex items-center space-x-2 mb-3 ${isAgent1 ? 'justify-start' : 'justify-end'}`}>
          {isAgent1 && (
            <>
              <div
                className={`w-7 h-7 rounded-neo ${bgColor} flex items-center justify-center`}
                style={{ boxShadow: `0 0 12px ${accentColor}40` }}
              >
                <Bot className={`w-4 h-4 ${textColor}`} />
              </div>
              <span className={`text-sm font-medium ${textColor}`}>{agentName}</span>
            </>
          )}
          {!isAgent1 && (
            <>
              <span className={`text-sm font-medium ${textColor}`}>{agentName}</span>
              <div
                className={`w-7 h-7 rounded-neo ${bgColor} flex items-center justify-center`}
                style={{ boxShadow: `0 0 12px ${accentColor}40` }}
              >
                <Bot className={`w-4 h-4 ${textColor}`} />
              </div>
            </>
          )}
          <span className="text-xs text-white/30">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>

        {/* Message Content */}
        <div className={`message-bubble ${bubbleClass} ${isAgent1 ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-white/90">
            {message.content}
          </div>

          {/* Message Metadata */}
          {(message.provider || message.model) && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-noir-border/30">
              <div className="flex items-center space-x-2 text-xs text-white/40">
                {message.provider && (
                  <span className="bg-noir-deep px-2 py-1 rounded-lg capitalize border border-noir-border/30">
                    {message.provider}
                  </span>
                )}
                {message.model && (
                  <span className="bg-noir-deep px-2 py-1 rounded-lg font-mono border border-noir-border/30">
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
