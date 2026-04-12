"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { isFirebaseConfigured, getFirebaseMessaging } from "@/lib/firebase";

const LS_FCM_TOKEN = "fcmToken";

/**
 * Manages FCM push-notification registration for the current user's device.
 *
 * Flow:
 *  1. registerFCMToken() — called when the user enables notifications
 *     a. Requests Notification permission
 *     b. Registers the dynamic service worker at /api/firebase-messaging-sw
 *     c. Calls getToken() with the VAPID public key
 *     d. Upserts the token in Convex (linked to the authenticated user)
 *     e. Caches the token in localStorage to avoid redundant registrations
 *
 *  2. unregisterFCMToken() — called when the user disables notifications
 *     a. Removes the token from Convex
 *     b. Clears the localStorage cache
 *
 * Returns:
 *  - fcmReady:            true once a token has been successfully stored
 *  - fcmSupported:        false in SSR / unsupported browsers
 *  - registerFCMToken:    async fn → "registered" | "denied" | "unsupported" | "error"
 *  - unregisterFCMToken:  async fn
 */
export function usePushNotifications() {
  const upsertToken = useMutation(api.pushTokens.upsertToken);
  const deleteToken = useMutation(api.pushTokens.deleteToken);

  // Start with false on both server and client to avoid hydration mismatch.
  // After mount, sync from localStorage on the client only.
  const [fcmReady, setFcmReady] = useState(false);

  useEffect(() => {
    setFcmReady(!!localStorage.getItem(LS_FCM_TOKEN));
  }, []);

  const registering = useRef(false);

  const fcmSupported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "Notification" in window &&
    isFirebaseConfigured();

  const registerFCMToken = useCallback(async (): Promise<
    "registered" | "denied" | "unsupported" | "error"
  > => {
    if (!fcmSupported) return "unsupported";
    if (registering.current) return "error";

    registering.current = true;

    try {
      // 1. Request browser notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return "denied";

      // 2. Register the service worker (served dynamically with env vars baked in)
      const swReg = await navigator.serviceWorker.register(
        "/api/firebase-messaging-sw",
        { scope: "/" }
      );
      // Wait for the SW to be active before calling getToken
      await navigator.serviceWorker.ready;

      // 3. Get FCM messaging instance (async — firebase/messaging is lazy-loaded
      //    to avoid the module running browser APIs during SSR)
      const messaging = await getFirebaseMessaging();
      if (!messaging) return "unsupported";

      const { getToken, onMessage } = await import("firebase/messaging");

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        console.warn(
          "[FCM] NEXT_PUBLIC_FIREBASE_VAPID_KEY is not set. Cannot get FCM token."
        );
        return "error";
      }

      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: swReg,
      });

      if (!token) return "error";

      // 4. Persist the token in Convex linked to the authenticated user
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await upsertToken({ token, timezone });

      // 5. Cache locally so we don't re-register on every page load
      localStorage.setItem(LS_FCM_TOKEN, token);
      setFcmReady(true);

      // 6. Handle foreground messages (app is open)
      //    These won't show a native notification automatically, so we
      //    dispatch a custom event that the NotificationProvider listens to.
      onMessage(messaging, (payload) => {
        const title = payload.notification?.title ?? "Habit Reminder";
        const body = payload.notification?.body ?? "";
        window.dispatchEvent(
          new CustomEvent("fcm-foreground-message", { detail: { title, body } })
        );
      });

      return "registered";
    } catch (err) {
      console.error("[FCM] Registration error:", err);
      return "error";
    } finally {
      registering.current = false;
    }
  }, [fcmSupported, upsertToken]);

  const unregisterFCMToken = useCallback(async () => {
    const token = localStorage.getItem(LS_FCM_TOKEN);
    if (!token) return;

    try {
      await deleteToken({ token });
    } catch {
      // Non-fatal — token may already be gone
    }

    localStorage.removeItem(LS_FCM_TOKEN);
    setFcmReady(false);
  }, [deleteToken]);

  return {
    fcmReady,
    fcmSupported,
    registerFCMToken,
    unregisterFCMToken,
  };
}
