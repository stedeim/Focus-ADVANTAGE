import { useEffect, useState } from 'react';

interface InstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isAppleMobile() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function InstallApp() {
  const [installed, setInstalled] = useState(() =>
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone),
  );
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [prompting, setPrompting] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)');
    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPrompt(null);
    };
    const onDisplayModeChange = (event: MediaQueryListEvent) => setInstalled(event.matches);

    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);
    standalone.addEventListener('change', onDisplayModeChange);
    return () => {
      window.removeEventListener('beforeinstallprompt', onInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      standalone.removeEventListener('change', onDisplayModeChange);
    };
  }, []);

  if (installed) return null;

  async function install() {
    if (!prompt) {
      setShowHelp((open) => !open);
      return;
    }

    setPrompt(null);
    setShowHelp(false);
    setPrompting(true);
    try {
      await prompt.prompt();
    } catch {
      setShowHelp(true);
    } finally {
      setPrompting(false);
    }
  }

  return (
    <aside aria-label="Install Focus Advantage" className="sticky top-0 z-30 border-b border-white/10 bg-navy-dark px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-center text-sm text-white">
      <button
        type="button"
        className="min-h-11 rounded-xl border border-gold/40 px-4 font-semibold text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        onClick={() => void install()}
        disabled={prompting}
        aria-expanded={prompt || prompting ? undefined : showHelp}
        aria-controls="install-help"
      >
        {prompt || prompting || !isAppleMobile() ? 'Install app' : 'Add to Home Screen'}
      </button>
      <p id="install-help" hidden={!showHelp} className="mx-auto mt-2 max-w-lg text-white/85">
        {isAppleMobile()
          ? 'In Safari, tap Share, then Add to Home Screen. If you see Open as Web App, leave it on, then tap Add.'
          : 'Open your browser menu and choose Install app or Add to Home screen. If you’re in an in-app browser, open this page in Chrome first.'}
      </p>
    </aside>
  );
}
