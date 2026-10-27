export type MonthKey = { year: number; month: number }; // month: 0-11

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function monthOf(date: Date | string): MonthKey {
  const d = typeof date === "string" ? new Date(date) : date;
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function sameMonth(a: MonthKey, b: MonthKey) {
  return a.year === b.year && a.month === b.month;
}

/** Compara meses: negativo si a < b. */
export function compareMonths(a: MonthKey, b: MonthKey) {
  return a.year * 12 + a.month - (b.year * 12 + b.month);
}

export function addMonths(key: MonthKey, delta: number): MonthKey {
  const total = key.year * 12 + key.month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** "Octubre 2026" */
export function monthLabel(key: MonthKey) {
  return `${capitalize(MONTHS[key.month])} ${key.year}`;
}

/** "octubre" */
export function monthName(month: number) {
  return MONTHS[month];
}

/** "27 de octubre de 2026" */
export function longDate(d: Date) {
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Días de diferencia en calendario local: 0 = hoy, 1 = ayer. */
export function daysAgo(date: Date, now: Date) {
  return Math.round((startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000);
}

/** "Hoy", "Ayer" o "27 oct 2026". */
export function relativeDay(iso: string, now: Date = new Date()) {
  const d = new Date(iso);
  const diff = daysAgo(d, now);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

/** Texto para lectores de pantalla: "hoy" o "27 de octubre de 2026". */
export function spokenDay(iso: string, now: Date = new Date()) {
  const d = new Date(iso);
  const diff = daysAgo(d, now);
  if (diff === 0) return "hoy";
  if (diff === 1) return "ayer";
  return longDate(d);
}
