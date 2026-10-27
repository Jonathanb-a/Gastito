import { CATEGORIES, CATEGORY_IDS, getCategory, isCategoryId } from "../categories";

const channel = (v: number) => {
  v /= 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// background y surface de global.css, claro y oscuro.
const SURFACES = ["#F8FAFC", "#FFFFFF", "#0B1220", "#111A2C"];

describe("categorías", () => {
  it("hay una por id, sin repetir, con icono y color", () => {
    expect(CATEGORIES.map((c) => c.id)).toEqual([...CATEGORY_IDS]);
    expect(new Set(CATEGORIES.map((c) => c.color)).size).toBe(CATEGORIES.length);
    for (const c of CATEGORIES) {
      expect(c.name).not.toBe("");
      expect(c.icon).toBeTruthy();
      expect(c.color).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it.each(CATEGORIES.map((c) => [c.id, c.color] as const))(
    "%s tiene contraste >= 3:1 en ambos temas",
    (_id, color) => {
      for (const surface of SURFACES) {
        expect(contrast(color, surface)).toBeGreaterThanOrEqual(3);
      }
    },
  );

  it("getById e isCategoryId", () => {
    expect(getCategory("salud").name).toBe("Salud");
    expect(isCategoryId("salud")).toBe(true);
    expect(isCategoryId("x")).toBe(false);
    expect(isCategoryId(undefined)).toBe(false);
  });
});
