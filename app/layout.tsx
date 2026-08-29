import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { ProvidersWrapper } from "@/components/providers/providers-wrapper";
import { CapacitorInit } from "@/components/capacitor-init";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--nf-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--nf-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--nf-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#C2410C",
};

export const metadata: Metadata = {
  title: "RoutineIQ — Build Better Habits",
  description:
    "Identity-first habit transformation with 3D streak crystals, reflection memories, and ambient focus soundscapes.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RoutineIQ",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icons/apple-touch-icon.png",
  },
};

/**
 * Inline script that runs synchronously before React hydration to apply the
 * saved theme class. Prevents a flash of the wrong theme on page load.
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme')||'light';if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the inline script may add "light" before React
    // hydrates, causing a class mismatch between server and client HTML.
    <html
      lang="en"
      className={`h-full ${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          iOS splash screens — static images shown while the app launches in standalone mode.
          Generate these from the HabitFlow logo + brand colors (#FAF8F4 background, #C2410C accent)
          using https://appsco.pe/developer/splash-screens or `npx pwa-asset-generator`.
          Required size = device logical resolution × pixel ratio (portrait only for now).
        */}
        {/* iPhone 16 Pro Max — 440×956 @3x */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/splash/iPhone_16_Pro_Max_portrait.png" />
        {/* iPhone 16 Pro — 402×874 @3x */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/splash/iPhone_16_Pro_portrait.png" />
        {/* iPhone 16 Plus / 15 Plus / 14 Pro Max — 430×932 @3x */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/splash/iPhone_16_Plus_portrait.png" />
        {/* iPhone 16 / 15 / 14 — 390×844 @3x */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/splash/iPhone_16_portrait.png" />
        {/* iPhone 15 Pro / 14 Pro — 393×852 @3x */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/splash/iPhone_15_Pro_portrait.png" />
        {/* iPhone SE (3rd gen) / 8 / 7 / 6s — 375×667 @2x */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/splash/iPhone_SE_portrait.png" />
        {/* iPad Pro 13" — 1024×1366 @2x */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/splash/iPad_Pro_13_portrait.png" />
        {/* iPad Pro 11" / iPad Air (M2) — 834×1194 @2x */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/splash/iPad_Pro_11_portrait.png" />
        {/* iPad mini (6th gen) — 744×1133 @2x */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/splash/iPad_mini_portrait.png" />
      </head>
      <body className="h-full antialiased" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <CapacitorInit />
        <ProvidersWrapper>{children}</ProvidersWrapper>
      </body>
    </html>
  );
}
