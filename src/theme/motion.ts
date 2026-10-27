import {
  Easing,
  FadeOut,
  FadeInDown,
  LinearTransition,
  ReduceMotion,
  type WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";

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

/**
 * Con "reducir movimiento" activo (sistema o navegador) Reanimated salta directo al
 * valor final. Pásalo siempre en las animaciones que escribas a mano.
 */
export const reduceMotion = ReduceMotion.System;

export const timing = {
  fast: { duration: duration.fast, easing: easing.out, reduceMotion } satisfies WithTimingConfig,
  base: { duration: duration.base, easing: easing.out, reduceMotion } satisfies WithTimingConfig,
  slow: { duration: duration.slow, easing: easing.out, reduceMotion } satisfies WithTimingConfig,
  exit: { duration: duration.fast, easing: easing.in, reduceMotion } satisfies WithTimingConfig,
};

export const spring = {
  /** Feedback de pulsación: sin rebote visible. */
  press: { damping: 20, stiffness: 400, mass: 0.6 } satisfies WithSpringConfig,
  /** Hojas, tarjetas, elementos que se acomodan. */
  smooth: { damping: 22, stiffness: 220, mass: 1 } satisfies WithSpringConfig,
  /** Confirmaciones (gasto guardado). Un solo rebote leve. */
  bouncy: { damping: 14, stiffness: 240, mass: 1, reduceMotion } satisfies WithSpringConfig,
};

/** Escala al presionar. */
export const pressScale = 0.97;
/** Retardo entre elementos de una lista al entrar, tope total 300 ms. */
export const staggerStep = 40;
export const staggerMax = 300;
export const staggerDelay = (index: number) => Math.min(index * staggerStep, staggerMax);

/** Entrada: fundido + subida corta (predefinida de Reanimated; las personalizadas fallan en web). */
export const enterUp = (index = 0) =>
  FadeInDown.duration(duration.base).delay(staggerDelay(index)).easing(easing.out).reduceMotion(reduceMotion);

/** Salida de un elemento borrado. */
export const exitFade = FadeOut.duration(duration.fast).easing(easing.in).reduceMotion(reduceMotion);

/** Los demás elementos se acomodan cuando uno entra o sale. */
export const listLayout = LinearTransition.duration(duration.base).easing(easing.inOut).reduceMotion(reduceMotion);
