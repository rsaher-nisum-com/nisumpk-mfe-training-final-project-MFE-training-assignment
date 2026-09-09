import type { EventBus } from './eventBus';

declare global {
  interface Window {
    NISUM: EventBus;
  }
}

export {};
