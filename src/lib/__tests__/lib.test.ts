import type { Expense } from "@/data/types";

import { addMonths, compareMonths, daysInMonth, monthLabel, monthOf, relativeDay, spokenDay } from "../dates";
import { formatMoney, spokenMoney } from "../money";
import { filterExpenses, total, totalsByCategory } from "../stats";
import { parseAmount, validateExpenseForm } from "../validation";

const NOW = new Date(2026, 9, 27, 18, 0); // 27 oct 2026, hora local

const exp = (id: string, amount: number, categoryId: Expense["categoryId"], date: Date): Expense => ({
  id,
  amount,
  categoryId,
  note: "",
  date: date.toISOString(),
});

describe("fechas", () => {
  it("suma meses cruzando años", () => {
    expect(addMonths({ year: 2026, month: 11 }, 1)).toEqual({ year: 2027, month: 0 });
    expect(addMonths({ year: 2026, month: 0 }, -1)).toEqual({ year: 2025, month: 11 });
    expect(addMonths({ year: 2026, month: 5 }, -13)).toEqual({ year: 2025, month: 4 });
    expect(compareMonths({ year: 2026, month: 1 }, { year: 2025, month: 11 })).toBeGreaterThan(0);
  });

  it("etiquetas en español", () => {
    expect(monthLabel(monthOf(NOW))).toBe("Octubre 2026");
    expect(daysInMonth(2028, 1)).toBe(29);
    expect(relativeDay(NOW.toISOString(), NOW)).toBe("Hoy");
    expect(relativeDay(new Date(2026, 9, 26, 9).toISOString(), NOW)).toBe("Ayer");
    expect(relativeDay(new Date(2026, 9, 3, 9).toISOString(), NOW)).toBe("3 oct 2026");
    expect(spokenDay(new Date(2026, 9, 3, 9).toISOString(), NOW)).toBe("3 de octubre de 2026");
  });
});

describe("dinero", () => {
  it("formatea y lee en voz alta", () => {
    expect(formatMoney(1234.5)).toMatch(/1,234\.50/);
    expect(spokenMoney(1)).toBe("1 peso");
    expect(spokenMoney(85.5)).toBe("85 pesos con 50 centavos");
    expect(spokenMoney(10.01)).toBe("10 pesos con 1 centavo");
  });
});

describe("estadísticas", () => {
  const list = [
    exp("1", 100, "comida", new Date(2026, 9, 5)),
    exp("2", 300, "ocio", new Date(2026, 9, 6)),
    exp("3", 100, "comida", new Date(2026, 9, 7)),
    exp("4", 50, "comida", new Date(2026, 8, 30)),
  ];

  it("filtra por mes y categoría", () => {
    const oct = filterExpenses(list, { month: { year: 2026, month: 9 } });
    expect(oct.map((e) => e.id)).toEqual(["1", "2", "3"]);
    expect(filterExpenses(list, { month: { year: 2026, month: 9 }, categoryId: "comida" })).toHaveLength(2);
    expect(filterExpenses(list, { categoryId: "comida" })).toHaveLength(3);
    expect(filterExpenses(list, { categoryId: null })).toHaveLength(4);
  });

  it("totales y reparto por categoría", () => {
    const oct = filterExpenses(list, { month: { year: 2026, month: 9 } });
    expect(total(oct)).toBe(500);
    const rows = totalsByCategory(oct);
    expect(rows.map((r) => r.categoryId)).toEqual(["ocio", "comida"]);
    expect(rows[0]).toMatchObject({ total: 300, count: 1 });
    expect(rows[0].share).toBeCloseTo(0.6);
    expect(totalsByCategory([])).toEqual([]);
  });
});

describe("validación del formulario", () => {
  it("interpreta montos", () => {
    expect(parseAmount("12")).toBe(12);
    expect(parseAmount("12,50")).toBe(12.5);
    expect(parseAmount(" $1234.5 ")).toBe(1234.5);
    expect(parseAmount(".5")).toBe(0.5);
    expect(parseAmount("")).toBeNull();
    expect(parseAmount("abc")).toBeNull();
    expect(parseAmount("-5")).toBeNull();
    expect(parseAmount("1.234")).toBeNull();
    expect(parseAmount("1e3")).toBeNull();
  });

  const ok = { amountText: "50", categoryId: "comida", date: new Date(2026, 9, 27, 12) } as const;

  it("acepta datos válidos", () => {
    expect(validateExpenseForm(ok, NOW)).toEqual({ errors: {}, amount: 50 });
  });

  it("exige monto mayor a 0", () => {
    expect(validateExpenseForm({ ...ok, amountText: "" }, NOW).errors.amount).toMatch(/Escribe/);
    expect(validateExpenseForm({ ...ok, amountText: "0" }, NOW).errors.amount).toMatch(/mayor a 0/);
    expect(validateExpenseForm({ ...ok, amountText: "0.00" }, NOW).errors.amount).toMatch(/mayor a 0/);
    expect(validateExpenseForm({ ...ok, amountText: "x" }, NOW).errors.amount).toMatch(/números/);
  });

  it("exige categoría y fecha no futura", () => {
    expect(validateExpenseForm({ ...ok, categoryId: null }, NOW).errors.category).toBe("Elige una categoría.");
    expect(validateExpenseForm({ ...ok, date: new Date(2026, 10, 1) }, NOW).errors.date).toMatch(/futura/);
    expect(validateExpenseForm({ ...ok, date: new Date("x") }, NOW).errors.date).toMatch(/válida/);
  });
});
