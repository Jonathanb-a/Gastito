import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { getCategory } from "@/data/categories";
import type { Expense } from "@/data/types";
import { relativeDay, spokenDay } from "@/lib/dates";
import { formatMoney, spokenMoney } from "@/lib/money";
import { useTheme } from "@/theme/theme";

import { PressableScale } from "./Button";
import { CategoryIcon } from "./CategoryIcon";

type Props = {
  expense: Expense;
  onPress: () => void;
  /** Si se pasa, muestra un botón de borrar junto a la fila. */
  onDelete?: () => void;
};

export function ExpenseRow({ expense, onPress, onDelete }: Props) {
  const { colors } = useTheme();
  const category = getCategory(expense.categoryId);
  const title = expense.note || category.name;
  const label = `${title}, ${category.name}, ${spokenDay(expense.date)}, ${spokenMoney(expense.amount)}`;

  return (
    <View className="flex-row items-center gap-1 rounded-lg border border-border bg-surface">
      <PressableScale
        onPress={onPress}
        wrapperStyle={{ flex: 1 }}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint="Abre el gasto para editarlo"
        className="min-h-16 flex-1 flex-row items-center gap-3 px-3 py-2"
      >
        <CategoryIcon categoryId={expense.categoryId} />
        <View className="flex-1">
          <Text className="text-body font-medium text-foreground" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-footnote text-muted" numberOfLines={1}>
            {category.name} · {relativeDay(expense.date)}
          </Text>
        </View>
        <Text className="text-subtitle text-foreground" style={{ fontVariant: ["tabular-nums"] }}>
          {formatMoney(expense.amount)}
        </Text>
      </PressableScale>
      {onDelete ? (
        <PressableScale
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={`Borrar gasto ${title}`}
          className="mr-1 h-11 w-11 items-center justify-center rounded-full"
        >
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </PressableScale>
      ) : null}
    </View>
  );
}
