import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { NotificationCenter } from '@nisum-mfe/shared-ui';
import { NavBar } from './components/NavBar';
import { AuthWidget } from './components/AuthWidget';
import { AppRoutes } from './routes/AppRoutes';

/**
 * The application shell: layout, navigation, and the auth widget live here
 * permanently; the routed content in <main> is composed at runtime from
 * three independently-built and independently-deployed remotes (see
 * src/remotes.ts + webpack.config.js `remotes`).
 */
export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 24px',
            borderBottom: '1px solid var(--nisum-color-border, #e2e5ea)',
            background: '#fff',
          }}
        >
          <NavBar />
          <AuthWidget />
        </header>
        <main style={{ flex: 1, width: '100%', maxWidth: 1100, margin: '0 auto', padding: 24 }}>
          <AppRoutes />
        </main>
      </div>
      <NotificationCenter />
    </BrowserRouter>
  );
}
