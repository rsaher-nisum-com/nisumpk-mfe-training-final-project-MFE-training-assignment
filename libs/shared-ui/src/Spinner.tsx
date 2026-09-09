import React from 'react';

export function Spinner() {
  return <span className="nisum-spinner" role="status" aria-label="Loading" />;
}

export interface LoadingPanelProps {
  label?: string;
}

/** Full-width loading state used by every MFE and the gateway while data or a remote is loading. */
export function LoadingPanel({ label = 'Loading...' }: LoadingPanelProps) {
  return (
    <div className="nisum-loading-panel" role="status">
      <Spinner />
      <span>{label}</span>
    </div>
  );
}
