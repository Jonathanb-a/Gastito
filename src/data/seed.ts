import type { ExpenseInput } from "./types";

const DAY = 24 * 60 * 60 * 1000;

/** Datos de ejemplo de la primera vez, con fechas relativas a `now`. */
export function createSeedExpenses(now: Date = new Date()): ExpenseInput[] {
  const ago = (days: number, hour: number) => {
    const d = new Date(now.getTime() - days * DAY);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };
  return [
    { amount: 85.5, categoryId: "comida", note: "Tacos con amigos", date: ago(0, 14) },
    { amount: 32, categoryId: "transporte", note: "Metro y camión", date: ago(1, 8) },
    { amount: 640, categoryId: "compras", note: "Despensa semanal", date: ago(2, 18) },
    { amount: 199, categoryId: "ocio", note: "Suscripción de streaming", date: ago(4, 21) },
    { amount: 350, categoryId: "salud", note: "Consulta y medicinas", date: ago(6, 11) },
    { amount: 480, categoryId: "servicios", note: "Recibo de luz", date: ago(9, 10) },
    { amount: 3500, categoryId: "vivienda", note: "Renta del mes", date: ago(12, 9) },
    { amount: 120, categoryId: "otros", note: "", date: ago(15, 16) },
  ];
}
