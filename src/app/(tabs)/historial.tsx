import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";

import { AddButton } from "@/components/AddButton";
import { Chip } from "@/components/Chip";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ExpenseRow } from "@/components/ExpenseRow";
import { MonthSwitcher } from "@/components/MonthSwitcher";
import { Screen } from "@/components/Screen";
import { CATEGORIES, getCategory, type CategoryId } from "@/data/categories";
import { useExpenses } from "@/data/expense-store";
import type { Expense } from "@/data/types";
import { monthOf } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { filterExpenses, total } from "@/lib/stats";

export default function HistoryScreen() {
  const router = useRouter();
  const { expenses, loading, remove } = useExpenses();
  const currentMonth = monthOf(new Date());
  const [month, setMonth] = useState(currentMonth);
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null);
  const [toDelete, setToDelete] = useState<Expense | null>(null);

  const filtered = useMemo(() => filterExpenses(expenses, { month, categoryId }), [expenses, month, categoryId]);
  const sum = total(filtered);
  const summary = `${filtered.length === 1 ? "1 gasto" : `${filtered.length} gastos`} · ${formatMoney(sum)}`;

  const header = (
    <View className="gap-4 pb-2">
      <Text accessibilityRole="header" className="text-headline text-foreground">
        Historial
      </Text>
      <MonthSwitcher value={month} max={currentMonth} onChange={setMonth} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4" contentContainerClassName="gap-2 px-4">
        <View accessibilityRole="radiogroup" accessibilityLabel="Filtrar por categoría" className="flex-row gap-2">
          <Chip label="Todas" selected={categoryId === null} onPress={() => setCategoryId(null)} />
          {CATEGORIES.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              selected={categoryId === c.id}
              onPress={() => setCategoryId(c.id)}
              left={categoryId === c.id ? undefined : <CategoryIcon categoryId={c.id} size={24} />}
            />
          ))}
        </View>
      </ScrollView>

      <Text accessibilityLiveRegion="polite" className="text-footnote text-muted">
        {summary}
      </Text>
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <ExpenseRow
            expense={item}
            onPress={() => router.push({ pathname: "/gasto", params: { id: item.id } })}
            onDelete={() => setToDelete(item)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={
          loading ? undefined : (
            <Text className="py-8 text-center text-body text-muted">
              {categoryId
                ? `No hay gastos de ${getCategory(categoryId).name.toLowerCase()} en este mes.`
                : "No hay gastos en este mes."}
            </Text>
          )
        }
        contentContainerClassName="w-full max-w-xl self-center px-4 pb-28 pt-4"
      />
      <AddButton />
      <ConfirmDialog
        visible={toDelete !== null}
        title="¿Borrar este gasto?"
        message={
          toDelete
            ? `Se borrará "${toDelete.note || getCategory(toDelete.categoryId).name}" por ${formatMoney(toDelete.amount)}. Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Borrar gasto"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) void remove(toDelete.id);
          setToDelete(null);
        }}
      />
    </Screen>
  );
}
