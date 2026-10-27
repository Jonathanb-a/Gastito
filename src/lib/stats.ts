import type { CategoryId } from "@/data/categories";
import type { Expense } from "@/data/types";

import { monthOf, sameMonth, type MonthKey } from "./dates";
import { roundMoney } from "./money";

export function total(list: readonly Expense[]) {
  return roundMoney(list.reduce((sum, e) => sum + e.amount, 0));
}

export type CategoryTotal = {
  categoryId: CategoryId;
  total: number;
  count: number;
  /** Fracción del total, de 0 a 1. */
  share: number;
};

/** Totales por categoría, de mayor a menor, solo categorías con gastos. */
export function totalsByCategory(list: readonly Expense[]): CategoryTotal[] {
  const grand = list.reduce((sum, e) => sum + e.amount, 0);
  const map = new Map<CategoryId, { total: number; count: number }>();
  for (const e of list) {
    const cur = map.get(e.categoryId) ?? { total: 0, count: 0 };
    cur.total += e.amount;
    cur.count += 1;
    map.set(e.categoryId, cur);
  }
  return [...map.entries()]
    .map(([categoryId, v]) => ({
      categoryId,
      total: roundMoney(v.total),
      count: v.count,
      share: grand > 0 ? v.total / grand : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export type ExpenseFilter = { month?: MonthKey; categoryId?: CategoryId | null };

export function filterExpenses(list: readonly Expense[], { month, categoryId }: ExpenseFilter) {
  return list.filter(
    (e) => (!month || sameMonth(monthOf(e.date), month)) && (!categoryId || e.categoryId === categoryId),
  );
}
