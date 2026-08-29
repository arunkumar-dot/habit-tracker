"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemePalette =
  | "terracotta"
  | "cyber"
  | "emerald"
  | "ocean"
  | "sunset"
  | "monochrome";

export type ThemeMode = "light" | "dark" | "system";

export interface PaletteInfo {
  id: ThemePalette;
  name: string;
  description: string;
  accentLight: string;
  accentDark: string;
  bgDark: string;
}

export const THEME_PALETTES: PaletteInfo[] = [
  {
    id: "terracotta",
    name: "Obsidian Clay",
    description: "Warm terracotta and rich obsidian earthy tones",
    accentLight: "#C2410C",
    accentDark: "#E86F3C",
    bgDark: "#1A1614",
  },
  {
    id: "cyber",
    name: "Cyber Violet",
    description: "Deep midnight indigo with radiant ultraviolet neon",
    accentLight: "#7C3AED",
    accentDark: "#A78BFA",
    bgDark: "#090C16",
  },
  {
    id: "emerald",
    name: "Emerald Zen",
    description: "Botanical moss and serene mint forest ambiance",
    accentLight: "#059669",
    accentDark: "#34D399",
    bgDark: "#081410",
  },
  {
    id: "ocean",
    name: "Deep Ocean",
    description: "Nordic abyss navy with luminous sapphire blue",
    accentLight: "#0284C7",
    accentDark: "#38BDF8",
    bgDark: "#070E1A",
  },
  {
    id: "sunset",
    name: "Golden Hour",
    description: "Warm espresso with radiant amber and rose gold",
    accentLight: "#D97706",
    accentDark: "#F59E0B",
    bgDark: "#170F11",
  },
  {
    id: "monochrome",
    name: "Minimal Slate",
    description: "Pure stark titanium and deep graphite minimalism",
    accentLight: "#18181B",
    accentDark: "#FAFAFA",
    bgDark: "#0C0C0E",
  },
];

interface ThemeContextValue {
  palette: ThemePalette;
  mode: ThemeMode;
  theme: "light" | "dark"; // Resolved actual theme for compatibility
  setPalette: (palette: ThemePalette) => void;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  palette: "terracotta",
  mode: "light",
  theme: "light",
  setPalette: () => {},
  setMode: () => {},
  toggleTheme: () => {},
});

function applyThemeToDOM(palette: ThemePalette, resolvedTheme: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // Set Palette
  root.setAttribute("data-palette", palette);

  // Set Dark / Light Mode
  if (resolvedTheme === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<ThemePalette>("terracotta");
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedPalette = (localStorage.getItem("habitflow_palette") as ThemePalette | null) ?? "terracotta";
    const storedMode = (localStorage.getItem("habitflow_mode") as ThemeMode | null) ??
      (localStorage.getItem("theme") as "dark" | "light" | null) ??
      "light";

    setPaletteState(storedPalette);
    setModeState(storedMode);

    let actual: "light" | "dark" = "light";
    if (storedMode === "system") {
      actual = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      actual = storedMode;
    }
    setResolvedTheme(actual);
    applyThemeToDOM(storedPalette, actual);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (storedMode === "system") {
        const next = e.matches ? "dark" : "light";
        setResolvedTheme(next);
        applyThemeToDOM(storedPalette, next);
      }
    };
    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, []);

  function setPalette(nextPalette: ThemePalette) {
    setPaletteState(nextPalette);
    localStorage.setItem("habitflow_palette", nextPalette);
    applyThemeToDOM(nextPalette, resolvedTheme);
  }

  function setMode(nextMode: ThemeMode) {
    setModeState(nextMode);
    localStorage.setItem("habitflow_mode", nextMode);

    let actual: "light" | "dark" = "light";
    if (nextMode === "system") {
      actual = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      actual = nextMode;
    }
    setResolvedTheme(actual);
    localStorage.setItem("theme", actual);
    applyThemeToDOM(palette, actual);
  }

  function toggleTheme() {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    setMode(nextTheme);
  }

  return (
    <ThemeContext.Provider
      value={{
        palette,
        mode,
        theme: resolvedTheme,
        setPalette,
        setMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
