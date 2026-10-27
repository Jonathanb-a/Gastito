import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";

import { addMonths, compareMonths, daysInMonth, longDate, monthLabel, monthName, monthOf, startOfDay } from "@/lib/dates";
import { useTheme } from "@/theme/theme";

import { PressableScale } from "./Button";

const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

type Props = {
  value: Date;
  maxDate: Date;
  onChange: (d: Date) => void;
};

/** Calendario mensual propio (semana desde lunes) que funciona igual en web y móvil. */
export function CalendarPicker({ value, maxDate, onChange }: Props) {
  const { colors } = useTheme();
  const [view, setView] = useState(monthOf(value));
  const maxMonth = monthOf(maxDate);
  const offset = (new Date(view.year, view.month, 1).getDay() + 6) % 7;
  const days = daysInMonth(view.year, view.month);
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const rows = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  const today = startOfDay(new Date());
  const nextDisabled = compareMonths(view, maxMonth) >= 0;

  const pick = (day: number) => {
    // Conserva la hora del valor actual; en el día de hoy nunca pasa de "ahora".
    const next = new Date(view.year, view.month, day, value.getHours(), value.getMinutes());
    onChange(next > maxDate ? new Date(maxDate) : next);
  };

  return (
    <View className="rounded-lg border border-border bg-surface p-1.5">
      <View className="mb-2 flex-row items-center justify-between">
        <PressableScale
          onPress={() => setView(addMonths(view, -1))}
          accessibilityRole="button"
          accessibilityLabel="Mes anterior"
          className="h-11 w-11 items-center justify-center rounded-full"
        >
          <Ionicons name="chevron-back" size={22} color={colors.foreground} />
        </PressableScale>
        <Text accessibilityRole="header" accessibilityLiveRegion="polite" className="text-body font-semibold text-foreground">
          {monthLabel(view)}
        </Text>
        <PressableScale
          onPress={() => setView(addMonths(view, 1))}
          disabled={nextDisabled}
          accessibilityRole="button"
          accessibilityLabel="Mes siguiente"
          accessibilityState={{ disabled: nextDisabled }}
          className={`h-11 w-11 items-center justify-center rounded-full ${nextDisabled ? "opacity-40" : ""}`}
        >
          <Ionicons name="chevron-forward" size={22} color={colors.foreground} />
        </PressableScale>
      </View>

      <View className="flex-row" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {WEEKDAYS.map((d) => (
          <Text key={d} className="flex-1 text-center text-caption text-muted">
            {d.charAt(0)}
          </Text>
        ))}
      </View>

      {rows.map((row, r) => (
        <View key={r} className="flex-row">
          {row.map((day, i) => {
            if (day === null) return <View key={i} className="h-11 flex-1" />;
            const date = new Date(view.year, view.month, day);
            const disabled = date > maxDate;
            const selected =
              value.getFullYear() === view.year && value.getMonth() === view.month && value.getDate() === day;
            const isToday = date.getTime() === today.getTime();
            return (
              <View key={i} className="h-11 flex-1">
                {/* La zona táctil ocupa toda la celda (≥ 44 px de alto); el círculo es solo visual. */}
                <PressableScale
                  onPress={() => pick(day)}
                  disabled={disabled}
                  wrapperStyle={{ flex: 1 }}
                  accessibilityRole="button"
                  accessibilityLabel={`${WEEKDAYS[i]} ${day} de ${monthName(view.month)}${isToday ? ", hoy" : ""}`}
                  accessibilityState={{ selected, disabled }}
                  className={`h-11 items-center justify-center ${disabled ? "opacity-40" : ""}`}
                >
                  <View
                    className={`h-10 w-10 items-center justify-center rounded-full ${
                      selected ? "bg-primary" : isToday ? "border border-primary" : ""
                    }`}
                  >
                    <Text
                      className={`text-body ${selected ? "font-semibold text-primary-foreground" : "text-foreground"}`}
                    >
                      {day}
                    </Text>
                  </View>
                </PressableScale>
              </View>
            );
          })}
        </View>
      ))}
      <Text className="mt-2 text-center text-footnote text-muted">Seleccionada: {longDate(value)}</Text>
    </View>
  );
}
