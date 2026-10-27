import { Text } from "react-native";

import { PressableScale } from "./Button";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Contenido extra a la izquierda, p. ej. un icono. */
  left?: React.ReactNode;
  className?: string;
};

/** Opción seleccionable (rol "radio"). Agrúpalas dentro de un View con accessibilityRole="radiogroup". */
export function Chip({ label, selected, onPress, left, className = "" }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      className={`min-h-11 flex-row items-center gap-2 rounded-full border px-4 ${
        selected ? "border-primary bg-primary" : "border-outline bg-surface"
      } ${className}`}
    >
      {left}
      <Text className={`text-body font-medium ${selected ? "text-primary-foreground" : "text-foreground"}`}>
        {label}
      </Text>
    </PressableScale>
  );
}
