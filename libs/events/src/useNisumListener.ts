import { useEffect, useRef } from 'react';
import type { NisumEventMap, NisumEventName } from '@nisum-mfe/shared-types';
import { NISUM } from './eventBus';

/**
 * React hook wrapper around `NISUM.listener` that subscribes on mount and
 * unsubscribes on unmount automatically - the "listener cleanup" behavior
 * the brief calls out explicitly. The handler is kept in a ref so callers
 * can pass an inline arrow function without re-subscribing on every render.
 */
export function useNisumListener<K extends NisumEventName>(
  event: K,
  handler: (data: NisumEventMap[K]) => void,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const unsubscribe = NISUM.listener(event, (data) => handlerRef.current(data));
    return unsubscribe;
  }, [event]);
}
