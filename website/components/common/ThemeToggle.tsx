"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const themeEvent = "apnicars-theme-change";

function subscribeToTheme(callback: () => void) {
  window.addEventListener(themeEvent, callback);
  return () => window.removeEventListener(themeEvent, callback);
}

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "light");

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("apnicars-theme", nextTheme);
    window.dispatchEvent(new Event(themeEvent));
  }

  const isDark = theme === "dark";

  return (
    <button type="button" onClick={toggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} title={isDark ? "Light mode" : "Dark mode"} className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#d8e0dc] text-[#29463c] transition-all hover:border-[#94b02d] hover:bg-[#f1f6e7] dark:border-white/12 dark:text-white/80 dark:hover:border-[#c9ff49]/45 dark:hover:bg-white/[0.06] dark:hover:text-[#c9ff49] ${className}`}>
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
