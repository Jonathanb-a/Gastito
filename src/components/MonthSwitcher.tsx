import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { addMonths, compareMonths, monthLabel, type MonthKey } from "@/lib/dates";
import { useTheme } from "@/theme/theme";

import { PressableScale } from "./Button";

type Props = { value: MonthKey; max: MonthKey; onChange: (m: MonthKey) => void };

export function MonthSwitcher({ value, max, onChange }: Props) {
  const { colors } = useTheme();
  const atMax = compareMonths(value, max) >= 0;
  return (
    <View className="flex-row items-center justify-between rounded-lg border border-border bg-surface p-1">
      <PressableScale
        onPress={() => onChange(addMonths(value, -1))}
        accessibilityRole="button"
        accessibilityLabel="Mes anterior"
        className="h-11 w-11 items-center justify-center rounded-full"
      >
        <Ionicons name="chevron-back" size={22} color={colors.foreground} />
      </PressableScale>
      <Text accessibilityRole="header" accessibilityLiveRegion="polite" className="text-subtitle text-foreground">
        {monthLabel(value)}
      </Text>
      <PressableScale
        onPress={() => onChange(addMonths(value, 1))}
        disabled={atMax}
        accessibilityRole="button"
        accessibilityLabel="Mes siguiente"
        accessibilityState={{ disabled: atMax }}
        className={`h-11 w-11 items-center justify-center rounded-full ${atMax ? "opacity-40" : ""}`}
      >
        <Ionicons name="chevron-forward" size={22} color={colors.foreground} />
      </PressableScale>
    </View>
  );
}
