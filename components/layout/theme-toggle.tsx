"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] bg-transparent cursor-pointer"
        aria-label="Toggle theme"
      >
        <Moon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)]",
        "bg-transparent transition-all duration-[var(--duration-hover)]",
        "hover:border-[var(--color-border-hover)] hover:bg-[var(--color-background-tertiary)]",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]",
        "cursor-pointer"
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Moon
          className="h-4 w-4 transition-all duration-200"
          style={{
            color: isHovered ? "#facc15" : "var(--color-foreground)",
            filter: isHovered ? "drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))" : "none",
          }}
        />
      ) : (
        <Sun
          className="h-4 w-4 transition-all duration-200"
          style={{
            color: isHovered ? "#f59e0b" : "var(--color-foreground)",
            filter: isHovered ? "drop-shadow(0 0 8px rgba(245, 158, 11, 0.8))" : "none",
          }}
        />
      )}
    </button>
  );
}
