import React from 'react';
import { ErrorPanel } from './ErrorPanel';

export interface ErrorBoundaryProps {
  fallbackTitle?: string;
  fallbackMessage?: string;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Generic React error boundary. The gateway wraps every federated remote in
 * one of these (plus <Suspense>) so a runtime error thrown *inside* an
 * already-loaded remote is caught and shown as a "module unavailable"
 * fallback instead of crashing the whole shell - the other routes keep
 * working. "Retry" just clears the caught error and re-renders the children.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error): void {
    this.props.onError?.(error);
  }

  private handleRetry = (): void => {
    this.setState({ error: null });
  };

  render(): React.ReactNode {
    if (this.state.error) {
      return (
        <ErrorPanel
          title={this.props.fallbackTitle ?? 'Module unavailable'}
          message={this.props.fallbackMessage ?? 'This section is currently unavailable. Please try again.'}
          onRetry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}
