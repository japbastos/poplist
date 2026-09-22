"use client";

import { CalendarDays } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/components/layout/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  className?: string;
};

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();
  const currentPathname = pathname ?? "/";

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r bg-sidebar/95 text-sidebar-foreground shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <div className="border-b px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 text-lg font-semibold tracking-tight text-sidebar-foreground"
          >
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-md"
              priority
            />
            <span className="truncate">Poplist</span>
          </Link>
          <ThemeToggle />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Foco no dia atual</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Principal">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            currentPathname === item.href ||
            currentPathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-brand-secondary text-white shadow-sm shadow-brand-secondary/15"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" aria-hidden="true" />
          America/Recife
        </div>
      </div>
    </aside>
  );
}
