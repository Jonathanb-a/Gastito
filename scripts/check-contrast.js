// Valida contraste WCAG AA de los tokens de global.css (claro y oscuro).
const fs = require("fs");
const path = require("path");

const css = fs.readFileSync(path.join(__dirname, "..", "global.css"), "utf8");
const [light, dark] = [css.split("@media")[0], css.split("@media")[1]].map((block) => {
  const out = {};
  for (const m of block.matchAll(/--color-([a-z-]+):\s*(\d+) (\d+) (\d+)/g)) {
    out[m[1]] = [+m[2], +m[3], +m[4]];
  }
  return out;
});

const lum = ([r, g, b]) => {
  const c = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [primer plano, fondo, mínimo]: 4.5 texto normal, 3 componentes de UI.
const pairs = [
  ["foreground", "background", 4.5],
  ["foreground", "surface", 4.5],
  ["foreground", "surface-muted", 4.5],
  ["muted", "background", 4.5],
  ["muted", "surface", 4.5],
  ["muted", "surface-muted", 4.5],
  ["primary-foreground", "primary", 4.5],
  ["primary", "background", 4.5],
  ["primary", "surface", 4.5],
  ["success", "surface", 4.5],
  ["warning", "surface", 4.5],
  ["danger", "surface", 4.5],
  ["info", "surface", 4.5],
  ["success", "background", 4.5],
  ["warning", "background", 4.5],
  ["danger", "background", 4.5],
  ["info", "background", 4.5],
  ["outline", "background", 3],
  ["outline", "surface", 3],
  ["outline", "surface-muted", 3],
];

let failed = 0;
for (const [name, theme] of [["claro", light], ["oscuro", dark]]) {
  for (const [fg, bg, min] of pairs) {
    const r = ratio(theme[fg], theme[bg]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`${ok ? "OK  " : "FAIL"} ${name.padEnd(6)} ${fg} / ${bg}: ${r.toFixed(2)} (min ${min})`);
  }
}
process.exit(failed ? 1 : 0);
