import {
  BarChart3,
  Activity,
  CalendarCheck,
  CalendarDays,
  CheckSquare,
  FolderKanban,
  History,
  Settings,
  Timer,
} from "lucide-react";

export const navigationItems = [
  {
    href: "/today",
    label: "Hoje",
    icon: CalendarCheck,
  },
  {
    href: "/calendar",
    label: "Calendário",
    icon: CalendarDays,
  },
  {
    href: "/projects",
    label: "Projetos",
    icon: FolderKanban,
  },
  {
    href: "/tasks",
    label: "Tarefas",
    icon: CheckSquare,
  },
  {
    href: "/focus",
    label: "Foco",
    icon: Timer,
  },
  {
    href: "/trackers",
    label: "Trackers",
    icon: Activity,
  },
  {
    href: "/history",
    label: "Histórico",
    icon: History,
  },
  {
    href: "/reports",
    label: "Relatórios",
    icon: BarChart3,
  },
  {
    href: "/settings",
    label: "Configurações",
    icon: Settings,
  },
] as const;
