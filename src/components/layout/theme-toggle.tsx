"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem("poplist-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") {
      return "dark";
    }

    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  });

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <Tooltip label="Alternar tema">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Alternar tema"
        onClick={toggleTheme}
      >
        <Sun
          className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
          aria-hidden="true"
        />
        <Moon
          className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
          aria-hidden="true"
        />
      </Button>
    </Tooltip>
  );
}
