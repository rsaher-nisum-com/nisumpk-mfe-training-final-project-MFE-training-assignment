import React from 'react';
import { Button } from './Button';

export interface ErrorPanelProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/** Generic inline error state (API failure, invalid data, etc.) with an optional retry action. */
export function ErrorPanel({ title = 'Something went wrong', message, onRetry }: ErrorPanelProps) {
  return (
    <div className="nisum-error-panel" role="alert">
      <span className="nisum-error-panel__title">{title}</span>
      <span>{message}</span>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
