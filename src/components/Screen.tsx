import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Contenedor de pantalla: respeta el área segura superior y fija el fondo del tema. */
export function Screen({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {children}
    </View>
  );
}

/** Clases del contenido desplazable: centrado y con ancho máximo en pantallas grandes. */
export const CONTENT = "w-full max-w-xl self-center px-4 pb-28 pt-4";
