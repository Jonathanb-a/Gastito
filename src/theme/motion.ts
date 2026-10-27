import { Easing, type WithSpringConfig, type WithTimingConfig } from "react-native-reanimated";

/** Duraciones en ms. Ver DESIGN.md > Animación. */
export const duration = {
  instant: 100,
  fast: 160,
  base: 240,
  slow: 360,
} as const;

export const easing = {
  /** Entradas: empieza rápido y frena. */
  out: Easing.bezier(0.2, 0, 0, 1),
  /** Salidas: acelera hacia afuera. */
  in: Easing.bezier(0.4, 0, 1, 1),
  /** Cambios de estado en pantalla. */
  inOut: Easing.bezier(0.4, 0, 0.2, 1),
} as const;

export const timing = {
  fast: { duration: duration.fast, easing: easing.out } satisfies WithTimingConfig,
  base: { duration: duration.base, easing: easing.out } satisfies WithTimingConfig,
  exit: { duration: duration.fast, easing: easing.in } satisfies WithTimingConfig,
};

export const spring = {
  /** Feedback de pulsación: sin rebote visible. */
  press: { damping: 20, stiffness: 400, mass: 0.6 } satisfies WithSpringConfig,
  /** Hojas, tarjetas, elementos que se acomodan. */
  smooth: { damping: 22, stiffness: 220, mass: 1 } satisfies WithSpringConfig,
  /** Confirmaciones (gasto guardado). Un solo rebote leve. */
  bouncy: { damping: 14, stiffness: 240, mass: 1 } satisfies WithSpringConfig,
};

/** Escala al presionar. */
export const pressScale = 0.97;
/** Retardo entre elementos de una lista al entrar, tope total 300 ms. */
export const staggerStep = 40;
export const staggerMax = 300;
