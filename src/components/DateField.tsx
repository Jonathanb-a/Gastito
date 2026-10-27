import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";

import { daysAgo, longDate } from "@/lib/dates";
import { useTheme } from "@/theme/theme";

import { PressableScale } from "./Button";
import { CalendarPicker } from "./CalendarPicker";
import { Chip } from "./Chip";

type Props = {
  value: Date;
  /** Fecha máxima seleccionable (normalmente "ahora"). */
  maxDate: Date;
  onChange: (d: Date) => void;
  error?: string;
};

export function DateField({ value, maxDate, onChange, error }: Props) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const diff = daysAgo(value, maxDate);

  const setDaysAgo = (n: number) => {
    const d = new Date(maxDate);
    d.setDate(d.getDate() - n);
    onChange(d);
    setOpen(false);
  };

  return (
    <View className="gap-2">
      <Text className="text-body font-medium text-foreground">Fecha</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel="Atajos de fecha" className="flex-row gap-2">
        <Chip label="Hoy" selected={diff === 0} onPress={() => setDaysAgo(0)} />
        <Chip label="Ayer" selected={diff === 1} onPress={() => setDaysAgo(1)} />
      </View>
      <PressableScale
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityLabel={`Fecha: ${longDate(value)}`}
        accessibilityHint={open ? "Cierra el calendario" : "Abre el calendario para elegir otra fecha"}
        accessibilityState={{ expanded: open }}
        className={`min-h-12 flex-row items-center justify-between rounded-md border bg-surface px-4 ${
          error ? "border-danger" : "border-outline"
        }`}
      >
        <Text className="text-body text-foreground">{longDate(value)}</Text>
        <Ionicons name={open ? "chevron-up" : "calendar-outline"} size={22} color={colors.muted} />
      </PressableScale>
      {open ? (
        <CalendarPicker
          value={value}
          maxDate={maxDate}
          onChange={(d) => {
            onChange(d);
            setOpen(false);
          }}
        />
      ) : null}
      {error ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" className="text-footnote text-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
