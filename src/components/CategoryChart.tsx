import { Text, View } from "react-native";
import Animated, { FadeIn, ReduceMotion } from "react-native-reanimated";

import { getCategory } from "@/data/categories";
import { formatMoney, spokenMoney } from "@/lib/money";
import type { CategoryTotal } from "@/lib/stats";
import { duration } from "@/theme/motion";

import { CategoryIcon } from "./CategoryIcon";

/** Barras horizontales por categoría. Cada fila es legible por sí sola (texto + porcentaje). */
export function CategoryChart({ data }: { data: CategoryTotal[] }) {
  return (
    <View className="gap-4" accessibilityLabel="Gastos por categoría" accessibilityRole="list">
      {data.map((row) => {
        const c = getCategory(row.categoryId);
        const percent = Math.round(row.share * 100);
        return (
          <View
            key={row.categoryId}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`${c.name}: ${spokenMoney(row.total)}, ${percent} por ciento del total`}
            className="flex-row items-center gap-3"
          >
            <CategoryIcon categoryId={row.categoryId} size={36} />
            <View className="flex-1 gap-1.5">
              <View className="flex-row items-baseline justify-between">
                <Text className="text-body font-medium text-foreground">{c.name}</Text>
                <Text className="text-footnote text-muted" style={{ fontVariant: ["tabular-nums"] }}>
                  {formatMoney(row.total)} · {percent} %
                </Text>
              </View>
              <View className="h-2 overflow-hidden rounded-full bg-surface-muted">
                <Animated.View
                  entering={FadeIn.duration(duration.base).reduceMotion(ReduceMotion.System)}
                  style={{ width: `${Math.max(percent, 2)}%`, height: 8, borderRadius: 4, backgroundColor: c.color }}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
