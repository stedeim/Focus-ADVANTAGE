import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {InstallApp} from './components/InstallApp';
import {bootstrapNativeShell, hideNativeSplash, isNativeApp} from './lib/nativeShell';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Focus Advantage root element was not found.');
}

void bootstrapNativeShell().finally(() => {
  createRoot(root).render(
    <StrictMode>
      {!isNativeApp() && <InstallApp />}
      <App />
    </StrictMode>,
  );
  void hideNativeSplash();
});

if (!isNativeApp() && !import.meta.env.DEV && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.register('/sw.js').catch((error) => {
    console.warn('Focus Advantage service worker registration failed', error);
  });
}
