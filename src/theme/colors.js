// Fuente única de los colores del tema (ver DESIGN.md).
// CommonJS para que también lo lea tailwind.config.js y scripts/check-contrast.js.
// `npm run check:contrast` valida el contraste AA de estos pares.

const light = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  "surface-muted": "#F1F5F9",
  border: "#CBD5E1",
  outline: "#64748B",
  foreground: "#0F172A",
  muted: "#475569",
  primary: "#0F766E",
  "primary-foreground": "#FFFFFF",
  success: "#15803D",
  warning: "#B45309",
  danger: "#B91C1C",
  info: "#1D4ED8",
};

const dark = {
  background: "#0B1220",
  surface: "#111A2C",
  "surface-muted": "#1A2438",
  border: "#26334C",
  outline: "#76869E",
  foreground: "#F1F5F9",
  muted: "#A3B1C6",
  primary: "#2DD4BF",
  "primary-foreground": "#042F2E",
  success: "#4ADE80",
  warning: "#FBBF24",
  danger: "#F87171",
  info: "#60A5FA",
};

module.exports = { light, dark };
