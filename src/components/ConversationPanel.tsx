import React, { useEffect, useRef } from 'react'
import { Play, Pause, Square, RotateCcw, Save, FileText } from 'lucide-react'
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
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

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

  const getStateButtonColor = () => {
    switch (conversationState) {
      case ConversationState.IDLE:
      case ConversationState.PAUSED:
        return 'btn-primary'
      case ConversationState.RUNNING:
        return 'bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors'
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
      <div className="flex items-center justify-between p-4 border-b border-dark-700 bg-dark-800">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold">
            {conversation?.title || 'New Conversation'}
          </h2>
          <div className={`status-indicator ${
            conversationState === ConversationState.IDLE ? 'status-idle' :
            conversationState === ConversationState.RUNNING ? 'status-running' :
            conversationState === ConversationState.PAUSED ? 'status-paused' :
            'status-error'
          }`} />
        </div>
        
        <div className="text-sm text-gray-400">
          {conversationMessages.length} messages
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No conversation yet</p>
              <p className="text-sm">Click "Start" to begin the agent conversation</p>
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
                  message.agentId === conversation?.agents[0].id
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
        <div className="p-4 bg-red-900/20 border-l-4 border-red-500 text-red-200">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{errorMessage}</p>
        </div>
      )}

      {/* Controls */}
      <div className="p-4 border-t border-dark-700 bg-dark-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              className={`flex items-center space-x-2 ${getStateButtonColor()}`}
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

          <div className="flex items-center space-x-3">
            <button
              className="btn-secondary flex items-center space-x-2"
              onClick={onNew}
            >
              <FileText className="w-4 h-4" />
              <span>New</span>
            </button>

            <button
              className="btn-secondary flex items-center space-x-2"
              onClick={onSave}
              disabled={!conversation || conversation.messages.length === 0}
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Status Text */}
        <div className="mt-3 text-sm text-gray-400">
          Status: {conversationState === ConversationState.IDLE && 'Ready to start'}
          {conversationState === ConversationState.RUNNING && 'Conversation in progress...'}
          {conversationState === ConversationState.PAUSED && 'Conversation paused'}
          {conversationState === ConversationState.ERROR && 'Error occurred'}
        </div>
      </div>
    </div>
  )
}