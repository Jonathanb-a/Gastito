export type ColorToken =
  | "background"
  | "surface"
  | "surface-muted"
  | "border"
  | "outline"
  | "foreground"
  | "muted"
  | "primary"
  | "primary-foreground"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type ThemeColors = Record<ColorToken, string>;

export const light: ThemeColors;
export const dark: ThemeColors;
