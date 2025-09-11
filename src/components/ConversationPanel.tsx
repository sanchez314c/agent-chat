import React, { useEffect, useRef } from 'react'
import { Play, Pause, Square, RotateCcw, Save, FileText, MessageSquare, Sparkles } from 'lucide-react'
import { ConversationState, type Conversation, type Message, MessageRole } from '../types'
import { MessageBubble } from './MessageBubble'

interface ConversationPanelProps {
  conversation: Conversation | null
  conversationState: ConversationState
  errorMessage?: string
  onStart: () => void
  onStop: () => void
  onPause: () => void
  onResume: () => void
  onNew: () => void
  onSave: () => void
}

export function ConversationPanel({
  conversation,
  conversationState,
  errorMessage,
  onStart,
  onStop,
  onPause,
  onResume,
  onNew,
  onSave
}: ConversationPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const messageCount = conversation?.messages?.length ?? 0
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messageCount])

  const getStateIcon = () => {
    switch (conversationState) {
      case ConversationState.IDLE:
        return <Play className="w-4 h-4" />
      case ConversationState.RUNNING:
        return <Pause className="w-4 h-4" />
      case ConversationState.PAUSED:
        return <Play className="w-4 h-4" />
      case ConversationState.ERROR:
        return <RotateCcw className="w-4 h-4" />
    }
  }

  const getStateButtonText = () => {
    switch (conversationState) {
      case ConversationState.IDLE:
        return 'Start'
      case ConversationState.RUNNING:
        return 'Pause'
      case ConversationState.PAUSED:
        return 'Resume'
      case ConversationState.ERROR:
        return 'Retry'
    }
  }

  const getStateButtonClass = () => {
    switch (conversationState) {
      case ConversationState.IDLE:
      case ConversationState.PAUSED:
        return 'btn-primary'
      case ConversationState.RUNNING:
        return 'btn-warning'
      case ConversationState.ERROR:
        return 'btn-danger'
    }
  }

  const handleMainButtonClick = () => {
    switch (conversationState) {
      case ConversationState.IDLE:
        onStart()
        break
      case ConversationState.RUNNING:
        onPause()
        break
      case ConversationState.PAUSED:
        onResume()
        break
      case ConversationState.ERROR:
        onStart()
        break
    }
  }

  const conversationMessages = conversation?.messages?.filter(m => m.role !== MessageRole.SYSTEM) || []

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-noir-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-neo bg-neon-500/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-neon-400" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-white">
                {conversation?.title || 'New Conversation'}
              </h2>
              <div className={`status-indicator ${
                conversationState === ConversationState.IDLE ? 'status-idle' :
                conversationState === ConversationState.RUNNING ? 'status-running' :
                conversationState === ConversationState.PAUSED ? 'status-paused' :
                'status-error'
              }`} />
            </div>
            <p className="text-xs text-white/40">{conversationMessages.length} messages</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="btn-secondary flex items-center space-x-2 py-2 px-4"
            onClick={onNew}
          >
            <FileText className="w-4 h-4" />
            <span>New</span>
          </button>
          <button
            className="btn-secondary flex items-center space-x-2 py-2 px-4"
            onClick={onSave}
            disabled={!conversation || conversation.messages.length === 0}
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-neo-lg bg-noir-surface/50 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-cyber-400/40" />
              </div>
              <p className="text-lg font-medium text-white/60 mb-2">No conversation yet</p>
              <p className="text-sm text-white/30">Click "Start" to begin the agent conversation</p>
            </div>
          </div>
        ) : (
          <>
            {conversationMessages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isAgent1={message.agentId === conversation?.agents[0].id}
                agentName={
                  message.role === MessageRole.OPERATOR
                    ? 'Operator'
                    : message.role === MessageRole.USER
                    ? 'User'
                    : message.agentId === conversation?.agents[0].id
                    ? conversation?.agents[0].name || 'Agent 1'
                    : conversation?.agents[1].name || 'Agent 2'
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mx-5 mb-4 p-4 neo-card bg-status-error/5 border-status-error/30">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-status-error" style={{ boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)' }} />
            <div>
              <p className="font-medium text-status-error">Error</p>
              <p className="text-sm mt-1 text-white/60">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="p-5 border-t border-noir-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              className={`flex items-center space-x-2 ${getStateButtonClass()}`}
              onClick={handleMainButtonClick}
              disabled={!conversation}
            >
              {getStateIcon()}
              <span>{getStateButtonText()}</span>
            </button>

            <button
              className="btn-danger flex items-center space-x-2"
              onClick={onStop}
              disabled={conversationState === ConversationState.IDLE}
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </button>
          </div>

          {/* Status Text */}
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              conversationState === ConversationState.IDLE ? 'bg-noir-muted' :
              conversationState === ConversationState.RUNNING ? 'bg-status-optimal' :
              conversationState === ConversationState.PAUSED ? 'bg-status-warning' :
              'bg-status-error'
            }`} style={conversationState === ConversationState.RUNNING ? { boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' } : {}} />
            <span className="text-white/50">
              {conversationState === ConversationState.IDLE && 'Ready to start'}
              {conversationState === ConversationState.RUNNING && 'Conversation in progress...'}
              {conversationState === ConversationState.PAUSED && 'Conversation paused'}
              {conversationState === ConversationState.ERROR && 'Error occurred'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
