import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";

import { AddButton } from "@/components/AddButton";
import { Button } from "@/components/Button";
import { CategoryChart } from "@/components/CategoryChart";
import { ExpenseRow } from "@/components/ExpenseRow";
import { ListItem, Reveal } from "@/components/Reveal";
import { CONTENT, Screen } from "@/components/Screen";
import { useExpenses } from "@/data/expense-store";
import { monthLabel, monthOf } from "@/lib/dates";
import { formatMoney, spokenMoney } from "@/lib/money";
import { filterExpenses, total, totalsByCategory } from "@/lib/stats";
import { spring, timing } from "@/theme/motion";

/** Tarjeta del total: un rebote leve cuando el monto cambia (p. ej. al guardar un gasto). */
function TotalCard({ month, monthTotal, count }: { month: ReturnType<typeof monthOf>; monthTotal: number; count: number }) {
  const scale = useSharedValue(1);
  const previous = useRef(monthTotal);
  useEffect(() => {
    if (previous.current !== monthTotal) {
      scale.value = withSequence(withTiming(1.03, timing.fast), withSpring(1, spring.bouncy));
      previous.current = monthTotal;
    }
  }, [monthTotal, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <View
        accessible
        accessibilityLabel={`Total gastado en ${monthLabel(month)}: ${spokenMoney(monthTotal)}`}
        className="gap-1 rounded-xl border border-border bg-surface p-6"
      >
        <Text className="text-body text-muted">Total de {monthLabel(month)}</Text>
        <Text className="text-display text-foreground" style={{ fontVariant: ["tabular-nums"] }} adjustsFontSizeToFit numberOfLines={1}>
          {formatMoney(monthTotal)}
        </Text>
        <Text className="text-footnote text-muted">{count === 1 ? "1 gasto" : `${count} gastos`} este mes</Text>
      </View>
    </Animated.View>
  );
}

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

        <Reveal index={0}>
          <TotalCard month={month} monthTotal={monthTotal} count={monthExpenses.length} />
        </Reveal>

        <Reveal index={1}>
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
        </Reveal>

        <View className="gap-3">
          <Text accessibilityRole="header" className="text-title text-foreground">
            Últimos gastos
          </Text>
          {recent.length ? (
            <>
              {recent.map((e, i) => (
                <ListItem key={e.id} index={i + 2}>
                  <ExpenseRow expense={e} onPress={() => router.push({ pathname: "/gasto", params: { id: e.id } })} />
                </ListItem>
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
