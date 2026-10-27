let formatter: Intl.NumberFormat | null | undefined;

function getFormatter() {
  if (formatter === undefined) {
    try {
      formatter = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
    } catch {
      formatter = null;
    }
  }
  return formatter;
}

/** "$1,234.50" */
export function formatMoney(amount: number) {
  const f = getFormatter();
  if (f) return f.format(amount);
  return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/** "1234 pesos con 50 centavos" para lectores de pantalla. */
export function spokenMoney(amount: number) {
  const cents = Math.round(amount * 100);
  const pesos = Math.floor(cents / 100);
  const rest = cents % 100;
  const p = `${pesos} ${pesos === 1 ? "peso" : "pesos"}`;
  return rest ? `${p} con ${rest} ${rest === 1 ? "centavo" : "centavos"}` : p;
}

export function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}
