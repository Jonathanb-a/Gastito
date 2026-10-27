import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export type IconName = ComponentProps<typeof Ionicons>["name"];

export const CATEGORY_IDS = [
  "comida",
  "transporte",
  "vivienda",
  "servicios",
  "salud",
  "ocio",
  "compras",
  "otros",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type Category = {
  id: CategoryId;
  name: string;
  icon: IconName;
  /**
   * Color para el icono (y su fondo al 12-15 % de opacidad). Cumple 3:1 sobre
   * las superficies claras y oscuras del tema; lo verifica categories.test.ts.
   */
  color: string;
};

/** Categorías fijas: el usuario no las crea ni edita. */
export const CATEGORIES: readonly Category[] = [
  { id: "comida", name: "Comida", icon: "restaurant", color: "#EA580C" },
  { id: "transporte", name: "Transporte", icon: "bus", color: "#0891B2" },
  { id: "vivienda", name: "Vivienda", icon: "home", color: "#2563EB" },
  { id: "servicios", name: "Servicios", icon: "flash", color: "#D97706" },
  { id: "salud", name: "Salud", icon: "medkit", color: "#E11D48" },
  { id: "ocio", name: "Ocio", icon: "game-controller", color: "#9333EA" },
  { id: "compras", name: "Compras", icon: "bag", color: "#16A34A" },
  { id: "otros", name: "Otros", icon: "ellipsis-horizontal", color: "#64748B" },
];

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: CategoryId): Category {
  return BY_ID.get(id) as Category;
}

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && BY_ID.has(value as CategoryId);
}
