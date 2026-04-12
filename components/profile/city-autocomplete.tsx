"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from "react";
import { MapPin, Loader2 } from "lucide-react";

// ============================================
// Open-Meteo Geocoding API — free, no auth required
// Returns up to 8 cities matching `search`
// ============================================

interface TeleportCity {
  name: string;
  country: string;
  display: string; // "City, Country"
}

async function searchCities(query: string): Promise<TeleportCity[]> {
  if (!query.trim()) return [];

  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
  );
  if (!res.ok) return [];

  const data = await res.json() as {
    results?: Array<{
      name: string;
      country: string;
      admin1?: string;
    }>;
  };

  const results = data.results ?? [];

  return results.map((r) => {
    const display = r.admin1 ? `${r.name}, ${r.admin1}, ${r.country}` : `${r.name}, ${r.country}`;
    return {
      name: r.name,
      country: r.country,
      display,
    };
  });
}

// ============================================
// Component
// ============================================

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  name?: string;
}

export const CityAutocomplete = forwardRef<HTMLInputElement, CityAutocompleteProps>(
  function CityAutocomplete({ value, onChange, onBlur, error, name }, ref) {
    const [query, setQuery] = useState(value ?? "");
    const [results, setResults] = useState<TeleportCity[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Keep local query in sync when parent resets the form
    useEffect(() => {
      setQuery(value ?? "");
    }, [value]);

    // Debounced search — fires 300 ms after the user stops typing
    const handleInput = useCallback((raw: string) => {
      setQuery(raw);
      onChange(raw); // keep react-hook-form in sync while typing
      setActiveIndex(-1);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!raw.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const cities = await searchCities(raw);
          setResults(cities);
          setIsOpen(cities.length > 0);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    }, [onChange]);

    // Select a city from the dropdown
    const select = useCallback((city: TeleportCity) => {
      setQuery(city.display);
      onChange(city.display);
      setIsOpen(false);
      setResults([]);
    }, [onChange]);

    // Close on outside click
    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        const city = results[activeIndex];
        if (city) select(city);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    return (
      <div ref={containerRef} className="relative">
        {/* Label */}
        <label
          htmlFor="location-input"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--text-primary)" }}
        >
          Location
        </label>

        {/* Input wrapper */}
        <div className="relative">
          <input
            id="location-input"
            ref={ref}
            name={name}
            type="text"
            autoComplete="off"
            placeholder="Search city…"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            className="w-full rounded-xl px-3 py-2.5 pr-9 text-sm outline-none transition-colors"
            style={{
              background: "var(--bg-input)",
              border: `1px solid ${error ? "var(--accent-danger)" : "var(--border)"}`,
              color: "var(--text-primary)",
            }}
          />

          {/* Right icon — spinner while loading, pin otherwise */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {isLoading
              ? <Loader2 size={14} className="animate-spin" style={{ color: "var(--text-disabled)" }} />
              : <MapPin size={14} style={{ color: "var(--text-disabled)" }} />
            }
          </span>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-1 text-xs" style={{ color: "var(--accent-danger)" }}>
            {error}
          </p>
        )}

        {/* Dropdown */}
        {isOpen && results.length > 0 && (
          <ul
            role="listbox"
            className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl overflow-hidden shadow-xl"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
            }}
          >
            {results.map((city, i) => (
              <li
                key={city.display}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent input blur before click fires
                  select(city);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer text-sm transition-colors"
                style={{
                  background: i === activeIndex ? "var(--bg-hover)" : "transparent",
                  color: "var(--text-primary)",
                }}
              >
                <MapPin size={12} style={{ color: "var(--accent-primary)", flexShrink: 0 }} />
                <span className="font-medium truncate">{city.name}</span>
                {city.country && (
                  <span className="ml-auto text-xs flex-shrink-0" style={{ color: "var(--text-secondary)" }}>
                    {city.country}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
