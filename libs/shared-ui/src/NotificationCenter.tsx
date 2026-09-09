import React, { useCallback, useState } from 'react';
import { useNisumListener } from '@nisum-mfe/events';
import type { NisumEventMap } from '@nisum-mfe/shared-types';

interface Toast {
  id: number;
  message: string;
  level: NisumEventMap['notification:show']['level'];
}

let idCounter = 0;

/**
 * Generic toast host, mounted once by the gateway. It knows nothing about
 * carts or orders - it only listens for the reusable `notification:show`
 * NISUM event, which any app (or any other shared-ui consumer) can emit to
 * surface a message without importing this component or coupling to the
 * gateway's internals.
 */
export function NotificationCenter() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useNisumListener('notification:show', ({ message, level }) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, level }]);
    setTimeout(() => dismiss(id), 4000);
  });

  if (toasts.length === 0) return null;

  return (
    <div className="nisum-toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`nisum-toast nisum-toast--${toast.level}`}
          onClick={() => dismiss(toast.id)}
          role="status"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
