import React from 'react'
import { ConversationState } from '../types'

interface StatusBarProps {
  conversationState: ConversationState
  messageCount: number
  errorMessage?: string
}

export function StatusBar({ conversationState, messageCount }: StatusBarProps) {
  const getStatusText = () => {
    switch (conversationState) {
      case ConversationState.IDLE: return 'Ready'
      case ConversationState.RUNNING: return 'Running'
      case ConversationState.PAUSED: return 'Paused'
      case ConversationState.ERROR: return 'Error'
      default: return 'Ready'
    }
  }

  const getIndicatorClass = () => {
    switch (conversationState) {
      case ConversationState.RUNNING: return ''
      case ConversationState.PAUSED: return 'warning'
      case ConversationState.ERROR: return 'error'
      default: return 'idle'
    }
  }

  return (
    <div className="status-bar">
      <div className="status-left">
        <div className={`status-indicator ${getIndicatorClass()}`} />
        <span>Status: {getStatusText()}</span>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <span>{messageCount} message{messageCount !== 1 ? 's' : ''}</span>
      </div>
      <div className="status-right">
        <span className="app-version">v1.0.0</span>
      </div>
    </div>
  )
}
