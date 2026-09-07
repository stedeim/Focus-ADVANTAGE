import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {bootstrapNativeShell, hideNativeSplash} from './lib/nativeShell';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Focus Advantage root element was not found.');
}

void bootstrapNativeShell().finally(() => {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  void hideNativeSplash();
});
