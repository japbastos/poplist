import type { Metadata } from "next";
import Script from "next/script";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "Poplist",
  description: "Organização pessoal com tarefas, planejamento diário e foco.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var storedTheme = localStorage.getItem("poplist-theme");
                var theme = storedTheme || "dark";
                document.documentElement.classList.toggle("dark", theme === "dark");
                document.documentElement.style.colorScheme = theme;
              } catch (_) {
                document.documentElement.classList.add("dark");
                document.documentElement.style.colorScheme = "dark";
              }
            })();
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
