import { isCategoryId, type CategoryId } from "@/data/categories";

/** Acepta "12", "12.5", "12,50" y "$ 1234.5"; devuelve null si no es un número válido. */
export function parseAmount(text: string): number | null {
  const clean = text.replace(/[$\s]/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$|^\d*\.\d{1,2}$/.test(clean)) return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
}

export type FormErrors = { amount?: string; category?: string; date?: string };

export type ExpenseFormInput = {
  amountText: string;
  categoryId: CategoryId | null;
  date: Date;
};

export function validateExpenseForm(
  { amountText, categoryId, date }: ExpenseFormInput,
  now: Date = new Date(),
): { errors: FormErrors; amount: number | null } {
  const errors: FormErrors = {};
  const amount = parseAmount(amountText);

  if (amountText.trim() === "") {
    errors.amount = "Escribe el monto del gasto.";
  } else if (amount === null) {
    errors.amount = "Usa solo números, con máximo 2 decimales.";
  } else if (amount <= 0) {
    errors.amount = "El monto debe ser mayor a 0.";
  }

  if (!categoryId || !isCategoryId(categoryId)) {
    errors.category = "Elige una categoría.";
  }

  if (Number.isNaN(date.getTime())) {
    errors.date = "Elige una fecha válida.";
  } else if (date.getTime() > now.getTime() + 60_000) {
    errors.date = "La fecha no puede ser futura.";
  }

  return { errors, amount };
}
