import { Component, type ErrorInfo, type ReactNode } from 'react'
import './ErrorBoundary.css'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => this.setState({ hasError: false, error: undefined })

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="error-boundary">
          <div className="error-boundary__card">
            <span className="error-boundary__eyebrow">Error de presentación</span>
            <h2 className="error-boundary__title">Algo salió mal al renderizar el deck</h2>
            <p className="error-boundary__msg">{this.state.error?.message ?? 'Error desconocido'}</p>
            <button className="error-boundary__btn" onClick={this.handleReset}>
              Reintentar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
