// Ambient global augmentation only; a real `import` of a .d.ts-only file
// breaks Vite's module resolution in tests (it isn't a runtime module).
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./global.d.ts" />
import type { NisumEventMap, NisumEventName } from '@nisum-mfe/shared-types';

const PREFIX = 'nisum:';

/**
 * Reusable emitter/listener abstraction built on the browser's native
 * CustomEvent/EventTarget APIs. This is deliberately NOT a bespoke pub-sub
 * implementation - piggy-backing on EventTarget means it works with
 * DevTools' native event inspection, needs no polyfill, and behaves
 * identically whether the caller is the host or a federated remote, as long
 * as they all share one instance (see `NISUM` below and how it is marked a
 * Module Federation singleton in every app's webpack config).
 */
export class EventBus {
  constructor(private readonly target: EventTarget) {}

  /** Emit a typed event with its payload to every current listener. */
  emit<K extends NisumEventName>(event: K, data: NisumEventMap[K]): void {
    this.target.dispatchEvent(new CustomEvent(PREFIX + event, { detail: data }));
  }

  /**
   * Subscribe to a typed event. Returns an unsubscribe function - callers
   * (see useNisumListener) MUST call it on cleanup to avoid leaking
   * listeners across route changes / remote unmounts.
   */
  listener<K extends NisumEventName>(event: K, handler: (data: NisumEventMap[K]) => void): () => void {
    const wrapped = (nativeEvent: Event) => {
      handler((nativeEvent as CustomEvent<NisumEventMap[K]>).detail);
    };
    this.target.addEventListener(PREFIX + event, wrapped as EventListener);
    return () => this.target.removeEventListener(PREFIX + event, wrapped as EventListener);
  }
}

function resolveTarget(): EventTarget {
  if (typeof window !== 'undefined') return window;
  // Test/SSR environments without a window still get a working bus.
  return new EventTarget();
}

/** The single event bus instance every app in the monorepo imports. */
export const NISUM = new EventBus(resolveTarget());

/**
 * Attaches the shared bus to `window.NISUM` so it is reachable exactly like
 * the brief requires (`NISUM.emit(...)`, `NISUM.listener(...)` from the
 * console or any non-module script). Called once from the gateway's
 * bootstrap; guarded so calling it again (e.g. a remote running standalone)
 * is a no-op instead of replacing the shared instance.
 */
export function attachNisumToWindow(): void {
  if (typeof window === 'undefined') return;
  if (!window.NISUM) {
    window.NISUM = NISUM;
  }
}
