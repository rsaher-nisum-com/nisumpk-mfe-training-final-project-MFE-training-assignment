import React, { lazy } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RemoteBoundary } from '../components/RemoteBoundary';

const WorkingRemote = lazy(() => Promise.resolve({ default: () => <div>Loaded content</div> }));
const FailingRemote = lazy(() => Promise.reject(new Error('network down')));

describe('RemoteBoundary', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('shows a loading state while the remote chunk is pending', async () => {
    render(
      <RemoteBoundary name="Test Remote">
        <WorkingRemote />
      </RemoteBoundary>,
    );
    expect(screen.getByText(/loading test remote/i)).toBeInTheDocument();
    // Let the already-pending import settle within `act` so it doesn't bleed
    // an unwrapped state update into whichever test runs next.
    await screen.findByText('Loaded content');
  });

  it('renders the remote once it resolves', async () => {
    render(
      <RemoteBoundary name="Test Remote">
        <WorkingRemote />
      </RemoteBoundary>,
    );
    expect(await screen.findByText('Loaded content')).toBeInTheDocument();
  });

  it('shows a fallback instead of crashing when the remote fails to load', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <RemoteBoundary name="Test Remote">
        <FailingRemote />
      </RemoteBoundary>,
    );

    expect(await screen.findByText(/test remote is unavailable/i)).toBeInTheDocument();
    spy.mockRestore();
  });
});
