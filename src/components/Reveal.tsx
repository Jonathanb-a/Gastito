import type { ReactNode } from "react";
import Animated from "react-native-reanimated";

import { enterUp, exitFade, listLayout } from "@/theme/motion";

/** Entrada escalonada de una tarjeta o sección. `index` fija el retardo. */
export function Reveal({ index = 0, children }: { index?: number; children: ReactNode }) {
  // Reanimated no procesa className: la animación va en un Animated.View sin clases.
  return <Animated.View entering={enterUp(index)}>{children}</Animated.View>;
}

type ItemProps = {
  children: ReactNode;
  index?: number;
  /** false para elementos que ya estaban en pantalla al abrir (evita animar al hacer scroll). */
  animateEntering?: boolean;
  /** true si el padre es un FlatList con itemLayoutAnimation (ya acomoda los elementos). */
  inFlatList?: boolean;
};

/** Fila de lista: entra al agregarse, se desvanece al borrarse y las demás se acomodan. */
export function ListItem({ children, index = 0, animateEntering = true, inFlatList = false }: ItemProps) {
  return (
    <Animated.View
      entering={animateEntering ? enterUp(index) : undefined}
      exiting={exitFade}
      layout={inFlatList ? undefined : listLayout}
    >
      {children}
    </Animated.View>
  );
}
