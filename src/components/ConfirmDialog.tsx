import { Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated";

import { duration } from "@/theme/motion";

import { Button } from "./Button";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Confirmación para acciones destructivas. Es una capa propia (no Alert ni Modal) para que
 * se vea igual en web y móvil. Debe renderizarse como hijo directo de la pantalla.
 */
export function ConfirmDialog({ visible, title, message, confirmLabel, onConfirm, onCancel }: Props) {
  if (!visible) return null;
  const motion = ReduceMotion.System;
  return (
    <Animated.View
      entering={FadeIn.duration(duration.fast).reduceMotion(motion)}
      exiting={FadeOut.duration(duration.fast).reduceMotion(motion)}
      // Reanimated no procesa className, por eso estilos en línea.
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
      accessibilityViewIsModal
    >
      <View
        accessibilityRole="alert"
        accessibilityLabel={`${title}. ${message}`}
        className="w-full max-w-sm gap-4 rounded-xl border border-border bg-surface p-6"
      >
        <Text accessibilityRole="header" className="text-title text-foreground">
          {title}
        </Text>
        <Text className="text-body text-muted">{message}</Text>
        <View className="gap-3">
          <Button label={confirmLabel} variant="danger" onPress={onConfirm} />
          <Button label="Cancelar" variant="secondary" onPress={onCancel} />
        </View>
      </View>
    </Animated.View>
  );
}
