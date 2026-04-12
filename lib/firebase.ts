import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

/**
 * Public Firebase client config — these are safe to expose in the browser.
 * Security is enforced by Firebase Security Rules, NOT by keeping these secret.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Returns true if all required Firebase env vars are present.
 * Allows the rest of the app to gracefully skip FCM when unconfigured.
 */
export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
}

/**
 * Lazily initialises the Firebase app singleton.
 * Returns null if the config is incomplete (e.g. env vars not yet set).
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

/**
 * Returns the Firebase Cloud Messaging instance, or null when:
 *  - Firebase is not configured (env vars missing)
 *  - The browser does not support the Push API
 *  - Called in a non-browser context (SSR / Node)
 *
 * NOTE: firebase/messaging is imported dynamically here — NOT at the top of
 * the file. The module registers ServiceWorker listeners at import time, which
 * throws on the server (no window/navigator) and would crash SSR.
 */
export async function getFirebaseMessaging() {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;

  const app = getFirebaseApp();
  if (!app) return null;

  try {
    const { getMessaging } = await import("firebase/messaging");
    return getMessaging(app);
  } catch {
    return null;
  }
}
