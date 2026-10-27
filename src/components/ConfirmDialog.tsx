import { useEffect, useRef, type ComponentRef } from "react";
import { AccessibilityInfo, BackHandler, findNodeHandle, Platform, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { duration, easing, reduceMotion } from "@/theme/motion";

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
 * Al abrir mueve el foco al diálogo; Escape (web) y "atrás" (Android) lo cancelan.
 */
export function ConfirmDialog({ visible, title, message, confirmLabel, onConfirm, onCancel }: Props) {
  const titleRef = useRef<ComponentRef<typeof Text>>(null);
  const cancelRef = useRef(onCancel);
  cancelRef.current = onCancel;

  useEffect(() => {
    if (!visible) return;
    if (Platform.OS === "web") {
      // La capa empieza oculta mientras anima su entrada; el foco solo entra cuando ya es visible.
      const timer = setTimeout(() => (titleRef.current as unknown as HTMLElement | null)?.focus?.(), 120);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && cancelRef.current();
      document.addEventListener("keydown", onKey);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", onKey);
      };
    }
    const node = findNodeHandle(titleRef.current);
    if (node) AccessibilityInfo.setAccessibilityFocus(node);
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      cancelRef.current();
      return true;
    });
    return () => sub.remove();
  }, [visible]);

  if (!visible) return null;
  return (
    <Animated.View
      entering={FadeIn.duration(duration.fast).reduceMotion(reduceMotion)}
      exiting={FadeOut.duration(duration.fast).easing(easing.in).reduceMotion(reduceMotion)}
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
        className="w-full max-w-sm gap-4 rounded-xl border border-border bg-surface p-6"
      >
        <Text ref={titleRef} tabIndex={-1} accessibilityRole="header" className="text-title text-foreground">
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
