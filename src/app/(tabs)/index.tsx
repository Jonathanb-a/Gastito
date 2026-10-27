import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

import { AddButton } from "@/components/AddButton";
import { Button } from "@/components/Button";
import { CategoryChart } from "@/components/CategoryChart";
import { ExpenseRow } from "@/components/ExpenseRow";
import { CONTENT, Screen } from "@/components/Screen";
import { useExpenses } from "@/data/expense-store";
import { monthLabel, monthOf } from "@/lib/dates";
import { formatMoney, spokenMoney } from "@/lib/money";
import { filterExpenses, total, totalsByCategory } from "@/lib/stats";

export default function HomeScreen() {
  const router = useRouter();
  const { expenses, loading } = useExpenses();
  const month = monthOf(new Date());

  const monthExpenses = useMemo(() => filterExpenses(expenses, { month }), [expenses, month.year, month.month]);
  const monthTotal = total(monthExpenses);
  const byCategory = useMemo(() => totalsByCategory(monthExpenses), [monthExpenses]);
  const recent = expenses.slice(0, 5);

  return (
    <Screen>
      <ScrollView contentContainerClassName={`${CONTENT} gap-6`}>
        <Text accessibilityRole="header" className="text-headline text-foreground">
          Inicio
        </Text>

        <View
          accessible
          accessibilityLabel={`Total gastado en ${monthLabel(month)}: ${spokenMoney(monthTotal)}`}
          className="gap-1 rounded-xl border border-border bg-surface p-6"
        >
          <Text className="text-body text-muted">Total de {monthLabel(month)}</Text>
          <Text className="text-display text-foreground" style={{ fontVariant: ["tabular-nums"] }}>
            {formatMoney(monthTotal)}
          </Text>
          <Text className="text-footnote text-muted">
            {monthExpenses.length === 1 ? "1 gasto" : `${monthExpenses.length} gastos`} este mes
          </Text>
        </View>

        <View className="gap-4">
          <Text accessibilityRole="header" className="text-title text-foreground">
            Por categoría
          </Text>
          {loading ? (
            <Text className="text-body text-muted">Cargando…</Text>
          ) : byCategory.length ? (
            <View className="rounded-lg border border-border bg-surface p-4">
              <CategoryChart data={byCategory} />
            </View>
          ) : (
            <Text className="text-body text-muted">Aún no hay gastos este mes. Agrega el primero con el botón de abajo.</Text>
          )}
        </View>

        <View className="gap-3">
          <Text accessibilityRole="header" className="text-title text-foreground">
            Últimos gastos
          </Text>
          {recent.length ? (
            <>
              {recent.map((e) => (
                <ExpenseRow key={e.id} expense={e} onPress={() => router.push({ pathname: "/gasto", params: { id: e.id } })} />
              ))}
              <Button label="Ver todo el historial" variant="secondary" onPress={() => router.push("/historial")} />
            </>
          ) : (
            !loading && <Text className="text-body text-muted">No hay gastos registrados.</Text>
          )}
        </View>
      </ScrollView>
      <AddButton />
    </Screen>
  );
}
