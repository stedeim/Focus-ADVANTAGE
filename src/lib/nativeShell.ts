import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { handleNativeAuthUrl } from './supabaseClient';

export const isNativeApp = () => Capacitor.isNativePlatform();

export async function bootstrapNativeShell() {
  if (!isNativeApp()) {
    return;
  }

  try {
    await StatusBar.setStyle({ style: Style.Light });
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#050B15' });
    }
  } catch (error) {
    console.warn('Status bar setup skipped', error);
  }

  App.addListener('appUrlOpen', ({ url }) => {
    void handleNativeAuthUrl(url);
  });

  try {
    const launch = await App.getLaunchUrl();
    if (launch?.url) {
      await handleNativeAuthUrl(launch.url);
    }
  } catch (error) {
    console.warn('Launch URL check skipped', error);
  }
}

export async function hideNativeSplash() {
  if (!isNativeApp()) {
    return;
  }

  try {
    await SplashScreen.hide();
  } catch (error) {
    console.warn('Splash hide skipped', error);
  }
}
