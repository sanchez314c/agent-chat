import React from 'react'
import { Activity, MessageCircle, AlertTriangle } from 'lucide-react'
import { ConversationState } from '../types'

interface StatusBarProps {
  conversationState: ConversationState
  messageCount: number
  errorMessage?: string
}

export function StatusBar({ conversationState, messageCount, errorMessage }: StatusBarProps) {
  const getStatusColor = () => {
    switch (conversationState) {
      case ConversationState.IDLE:
        return 'text-gray-400'
      case ConversationState.RUNNING:
        return 'text-green-400'
      case ConversationState.PAUSED:
        return 'text-yellow-400'
      case ConversationState.ERROR:
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusText = () => {
    switch (conversationState) {
      case ConversationState.IDLE:
        return 'Ready'
      case ConversationState.RUNNING:
        return 'Running'
      case ConversationState.PAUSED:
        return 'Paused'
      case ConversationState.ERROR:
        return 'Error'
      default:
        return 'Unknown'
    }
  }

  const getStatusIcon = () => {
    switch (conversationState) {
      case ConversationState.IDLE:
        return <Activity className="w-4 h-4" />
      case ConversationState.RUNNING:
        return <Activity className="w-4 h-4 animate-pulse" />
      case ConversationState.PAUSED:
        return <Activity className="w-4 h-4" />
      case ConversationState.ERROR:
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="h-8 bg-dark-900 border-t border-dark-700 px-4 flex items-center justify-between text-sm">
      {/* Left side - Status */}
      <div className="flex items-center space-x-4">
        <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>Status: {getStatusText()}</span>
        </div>
        
        {errorMessage && (
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="truncate max-w-xs">{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Right side - Message Count */}
      <div className="flex items-center space-x-4 text-gray-400">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4" />
          <span>{messageCount} messages</span>
        </div>
        
        <div className="text-xs text-gray-500">
          AgentCHAT v1.0.0
        </div>
      </div>
    </div>
  )
}