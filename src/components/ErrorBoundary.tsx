import React, { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="neo-panel" style={{ padding: '2rem', maxWidth: '600px', textAlign: 'center' }}>
            <h2 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
              Something went wrong
            </h2>
            <p style={{ color: '#9ca3af', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <pre style={{
              color: '#6b7280',
              fontSize: '0.75rem',
              textAlign: 'left',
              background: 'rgba(0,0,0,0.3)',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              maxHeight: '200px',
              marginBottom: '1rem'
            }}>
              {this.state.error?.stack}
            </pre>
            <button
              onClick={this.handleReset}
              style={{
                background: '#14b8a6',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
