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
  theme: "dark",
  toggleTheme: () => {},
});

function applyTheme(t: Theme) {
  if (t === "light") {
    document.documentElement.classList.add("light");
  } else {
    document.documentElement.classList.remove("light");
  }
}

/**
 * Provides theme context to the app.
 * - Reads initial value from localStorage (defaults to "dark").
 * - Persists changes to localStorage.
 * - Applies/removes the "light" class on <html> to activate CSS variable overrides.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Start with dark to match the server render; useEffect syncs with localStorage.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null) ?? "dark";
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
