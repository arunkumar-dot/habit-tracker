"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

function applyTheme(t: Theme) {
  if (t === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

/**
 * Provides theme context to the app.
 * - Reads initial value from localStorage (defaults to "light").
 * - Persists changes to localStorage.
 * - Sets/removes data-theme="dark" on <html> to activate CSS variable overrides.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Start with light to match the server render; useEffect syncs with localStorage.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null) ?? "light";
    setTheme(stored);
    applyTheme(stored);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
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
