const APP_TIME_ZONE = "America/Recife";

function formatDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Não foi possível formatar a data.");
  }

  return { day, month, year };
}

export function getTodayPlanDate() {
  const { day, month, year } = formatDateParts(new Date());

  return `${year}-${month}-${day}`;
}

export function isValidPlanDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function formatPlanDateLabel(planDate: string) {
  const [year, month, day] = planDate.split("-").map(Number);
  const localDate = new Date(year, month - 1, day, 12, 0, 0);

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: APP_TIME_ZONE,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(localDate);
}

export function addDaysToPlanDate(planDate: string, days: number) {
  const [year, month, day] = planDate.split("-").map(Number);
  const localDate = new Date(year, month - 1, day, 12, 0, 0);
  localDate.setDate(localDate.getDate() + days);

  const nextYear = localDate.getFullYear();
  const nextMonth = String(localDate.getMonth() + 1).padStart(2, "0");
  const nextDay = String(localDate.getDate()).padStart(2, "0");

  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function getMonthRange(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const startDate = `${year}-${String(monthNumber).padStart(2, "0")}-01`;
  const lastDay = new Date(year, monthNumber, 0).getDate();
  const endDate = `${year}-${String(monthNumber).padStart(2, "0")}-${String(
    lastDay,
  ).padStart(2, "0")}`;

  return { endDate, startDate };
}

export function getPlanDateMonth(planDate: string) {
  return planDate.slice(0, 7);
}

export function isValidMonth(value: string) {
  return /^\d{4}-\d{2}$/.test(value);
}

export function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const localDate = new Date(year, monthNumber - 1, 1, 12, 0, 0);

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: APP_TIME_ZONE,
    month: "long",
    year: "numeric",
  }).format(localDate);
}

export function getMonthCalendarDays(month: string) {
  const { endDate, startDate } = getMonthRange(month);
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDate = new Date(year, monthNumber - 1, 1, 12, 0, 0);
  const startOffset = firstDate.getDay();
  const days: string[] = [];

  for (let index = -startOffset; days.length < 42; index += 1) {
    days.push(addDaysToPlanDate(startDate, index));
  }

  return { days, endDate, startDate };
}
