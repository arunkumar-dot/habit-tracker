import type { CapacitorConfig } from '@capacitor/cli';

// Dev: CAPACITOR_SERVER_URL=http://192.168.1.2:3000 npx cap sync android
// Prod: CAPACITOR_SERVER_URL=https://tryhabitflow.com npx cap sync android
const DEV_SERVER = 'https://tryhabitflow.com';

const serverUrl = process.env.CAPACITOR_SERVER_URL ?? DEV_SERVER;
const isDev = serverUrl.startsWith('http://');

const config: CapacitorConfig = {
  appId: 'com.tryhabitflow.app',
  appName: 'Habit Flow',
  webDir: 'out',
  server: {
    url: serverUrl,
    cleartext: isDev,
    // Keep Clerk's auth domain and OAuth providers inside the WebView so
    // Android doesn't hand them off to Chrome.
    allowNavigation: [
      '*.clerk.accounts.dev',
      '*.clerk.com',
      'accounts.google.com',
      '*.google.com',
      'github.com',
      'api.github.com',
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FAF8F4',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      launchFadeOutDuration: 400,
    },
  },
};

export default config;
