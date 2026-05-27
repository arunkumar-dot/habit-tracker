// This service worker has been superseded by /firebase-messaging-sw.js,
// which is the single unified SW handling both offline caching and FCM push.
//
// This stub exists only so that browsers which still have the old /sw.js
// registration receive a clean update. skipWaiting() lets the new unified
// SW (registered by ServiceWorkerProvider) take over immediately.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
