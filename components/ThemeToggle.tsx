"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        flex items-center justify-center w-8 h-8 rounded
        border border-[var(--border)] bg-[var(--surface)]
        hover:border-[var(--amber)] hover:text-amber
        text-[var(--dim)] transition-all duration-200
      "
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark
        ? <Sun  size={14} strokeWidth={1.5} />
        : <Moon size={14} strokeWidth={1.5} />
      }
    </button>
  );
}
