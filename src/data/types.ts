import type { CategoryId } from "./categories";

export type Expense = {
  id: string;
  /** Importe positivo en la moneda del usuario, con máximo 2 decimales. */
  amount: number;
  categoryId: CategoryId;
  note: string;
  /** Fecha y hora del gasto en ISO 8601 (UTC), p. ej. "2026-10-27T18:30:00.000Z". */
  date: string;
};

/** Lo que el usuario captura; el id lo genera el store. */
export type ExpenseInput = Omit<Expense, "id">;
