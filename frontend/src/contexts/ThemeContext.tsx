"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const updateResolvedTheme = () => {
      let newResolvedTheme: "light" | "dark";
      
      if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        newResolvedTheme = prefersDark ? "dark" : "light";
      } else {
        newResolvedTheme = theme;
      }
      
      setResolvedTheme(newResolvedTheme);
      
      // Apply theme to document
      const root = document.documentElement;
      if (newResolvedTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    // Only run on client side
    if (typeof window !== "undefined") {
      updateResolvedTheme();

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        if (theme === "system") {
          updateResolvedTheme();
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  useEffect(() => {
    // Save theme preference
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      resolvedTheme, 
      setTheme: setThemeValue, 
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
