import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, Text, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";

import { pressScale, spring } from "@/theme/motion";
import { useTheme } from "@/theme/theme";

/** Pressable con escala sutil al pulsar (se omite con "reducir movimiento"). */
export function PressableScale({
  children,
  className,
  wrapperStyle,
  ...rest
}: PressableProps & { className?: string; children?: ReactNode; wrapperStyle?: StyleProp<ViewStyle> }) {
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[style, wrapperStyle]}>
      <Pressable
        {...rest}
        className={className}
        onPressIn={(e) => {
          if (!reduceMotion) scale.value = withSpring(pressScale, spring.press);
          rest.onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.value = withSpring(1, spring.press);
          rest.onPressOut?.(e);
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

type Variant = "primary" | "secondary" | "outline-danger" | "danger";

const VARIANTS: Record<Variant, { box: string; text: string; icon: "primary-foreground" | "foreground" | "danger" }> = {
  primary: { box: "bg-primary", text: "text-primary-foreground", icon: "primary-foreground" },
  secondary: { box: "bg-surface border border-outline", text: "text-foreground", icon: "foreground" },
  "outline-danger": { box: "bg-surface border border-danger", text: "text-danger", icon: "danger" },
  danger: { box: "bg-danger", text: "text-primary-foreground", icon: "primary-foreground" },
};

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: ComponentProps<typeof Ionicons>["name"];
  disabled?: boolean;
  hint?: string;
  className?: string;
};

export function Button({ label, onPress, variant = "primary", icon, disabled, hint, className = "" }: Props) {
  const { colors } = useTheme();
  const v = VARIANTS[variant];
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled: !!disabled }}
      className={`min-h-12 flex-row items-center justify-center gap-2 rounded-md px-4 ${v.box} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {icon ? <Ionicons name={icon} size={20} color={colors[v.icon]} /> : null}
      <Text className={`text-body font-semibold ${v.text}`}>{label}</Text>
    </PressableScale>
  );
}
