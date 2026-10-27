import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CONTENT, Screen } from "@/components/Screen";
import { useExpenses } from "@/data/expense-store";
import { useTheme, type ThemePreference } from "@/theme/theme";

const THEMES: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "Sistema" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
];

export default function SettingsScreen() {
  const { preference, setPreference } = useTheme();
  const { expenses, clear } = useExpenses();
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <Screen>
      <ScrollView contentContainerClassName={`${CONTENT} gap-6`}>
        <Text accessibilityRole="header" className="text-headline text-foreground">
          Ajustes
        </Text>

        <View className="gap-3 rounded-lg border border-border bg-surface p-4">
          <Text accessibilityRole="header" className="text-title text-foreground">
            Tema
          </Text>
          <Text className="text-body text-muted">"Sistema" sigue el modo claro u oscuro de tu dispositivo.</Text>
          <View accessibilityRole="radiogroup" accessibilityLabel="Tema de la aplicación" className="flex-row flex-wrap gap-2">
            {THEMES.map((t) => (
              <Chip key={t.value} label={t.label} selected={preference === t.value} onPress={() => setPreference(t.value)} />
            ))}
          </View>
        </View>

        <View className="gap-3 rounded-lg border border-border bg-surface p-4">
          <Text accessibilityRole="header" className="text-title text-foreground">
            Datos
          </Text>
          <Text className="text-body text-muted">
            Tus gastos se guardan solo en este dispositivo. Tienes {expenses.length === 1 ? "1 gasto" : `${expenses.length} gastos`}{" "}
            guardados.
          </Text>
          <Button
            label="Borrar todos los datos"
            variant="outline-danger"
            icon="trash-outline"
            disabled={expenses.length === 0}
            hint="Pide confirmación antes de borrar"
            onPress={() => {
              setDone(false);
              setConfirming(true);
            }}
          />
          {done ? (
            <Text accessibilityRole="alert" accessibilityLiveRegion="polite" className="text-footnote text-success">
              Se borraron todos los datos.
            </Text>
          ) : null}
        </View>
      </ScrollView>
      <ConfirmDialog
        visible={confirming}
        title="¿Borrar todos los datos?"
        message={`Se borrarán los ${expenses.length} gastos guardados. Esta acción no se puede deshacer.`}
        confirmLabel="Borrar todo"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          void clear().then(() => setDone(true));
          setConfirming(false);
        }}
      />
    </Screen>
  );
}
