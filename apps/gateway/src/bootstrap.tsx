import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@nisum-mfe/state';
import { attachNisumToWindow } from '@nisum-mfe/events';
import '@nisum-mfe/shared-ui/src/styles.css';
import App from './App';

// The gateway is the one place that attaches the shared bus to
// `window.NISUM` - every MFE only ever imports { NISUM } from
// '@nisum-mfe/events' and relies on this having already run.
attachNisumToWindow();

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  );
}
