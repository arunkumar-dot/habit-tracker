"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light" | "space" | "space-light";

const THEMES: Theme[] = ["light", "dark", "space", "space-light"];

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

function applyTheme(t: Theme) {
  const body = document.body;

  if (t === "light") {
    document.documentElement.removeAttribute("data-theme");
    body?.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", t);
    body?.setAttribute("data-theme", t);
  }
}

function isTheme(value: string | null): value is Theme {
  return value !== null && THEMES.includes(value as Theme);
}

function getNextTheme(theme: Theme): Theme {
  const currentIndex = THEMES.indexOf(theme);
  return THEMES[(currentIndex + 1) % THEMES.length] ?? "light";
}

/**
 * Provides theme context to the app.
 * - Reads initial value from localStorage (defaults to "light").
 * - Persists changes to localStorage.
 * - Sets/removes data-theme on <html> to activate CSS variable overrides.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Start with light to match the server render; useEffect syncs with localStorage.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = localStorage.getItem("theme");
      const stored = isTheme(value) ? value : "light";
      setTheme(stored);
      applyTheme(stored);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function toggleTheme() {
    setTheme((current) => {
      const next = getNextTheme(current);
      localStorage.setItem("theme", next);
      applyTheme(next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook to read the current theme and toggle it. */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
