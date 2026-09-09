import React, { Suspense } from 'react';
import { ErrorBoundary, LoadingPanel } from '@nisum-mfe/shared-ui';
import { createLogger } from '@nisum-mfe/utilities';

const logger = createLogger('gateway/RemoteBoundary');

export interface RemoteBoundaryProps {
  name: string;
  children: React.ReactNode;
}

/**
 * Every federated route is wrapped in one of these: <ErrorBoundary> catches
 * both a failed remoteEntry.js fetch (see src/remotes.ts) and a runtime
 * error thrown inside an already-loaded remote, while <Suspense> covers the
 * time the chunk is downloading. Either way the rest of the shell (nav,
 * other routes) keeps working - only this section shows a fallback.
 */
export function RemoteBoundary({ name, children }: RemoteBoundaryProps) {
  return (
    <ErrorBoundary
      fallbackTitle={`${name} is unavailable`}
      fallbackMessage="This section is currently unavailable. Please try again later."
      onError={(error) => logger.error(`Remote "${name}" crashed`, { error: error.message })}
    >
      <Suspense fallback={<LoadingPanel label={`Loading ${name}...`} />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
