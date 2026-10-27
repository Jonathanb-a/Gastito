import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

import { getCategory } from "@/data/categories";
import { formatMoney, spokenMoney } from "@/lib/money";
import type { CategoryTotal } from "@/lib/stats";
import { staggerDelay, timing } from "@/theme/motion";

import { CategoryIcon } from "./CategoryIcon";

/**
 * Barra que crece desde la izquierda hasta `share` (0-1). Anima con scaleX, no con width,
 * para no forzar layout, y también se anima cuando el valor cambia.
 */
function Bar({ share, color, index }: { share: number; color: string; index: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(staggerDelay(index), withTiming(Math.max(share, 0.02), timing.slow));
  }, [share, index, progress]);
  const style = useAnimatedStyle(() => ({ transform: [{ scaleX: progress.value }] }));

  return (
    <View className="h-2 overflow-hidden rounded-full bg-surface-muted">
      <Animated.View style={[{ height: 8, backgroundColor: color, transformOrigin: "left center" }, style]} />
    </View>
  );
}

/** Barras horizontales por categoría. Cada fila es legible por sí sola (texto + porcentaje). */
export function CategoryChart({ data }: { data: CategoryTotal[] }) {
  return (
    <View className="gap-4" accessibilityLabel="Gastos por categoría" accessibilityRole="list">
      {data.map((row, index) => {
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
              <View className="flex-row items-baseline justify-between gap-2">
                <Text className="shrink text-body font-medium text-foreground">{c.name}</Text>
                <Text className="text-footnote text-muted" style={{ fontVariant: ["tabular-nums"] }}>
                  {formatMoney(row.total)} · {percent} %
                </Text>
              </View>
              <Bar share={row.share} color={c.color} index={index} />
            </View>
          </View>
        );
      })}
    </View>
  );
}
