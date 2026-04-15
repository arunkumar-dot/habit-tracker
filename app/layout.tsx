import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "HabitFlow — Build Better Habits",
  description:
    "Track your habits, monitor consistency, and visualize your daily routine with a beautiful timeline view.",
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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-full antialiased" suppressHydrationWarning>
        <ClerkProvider>
          <ConvexClientProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
