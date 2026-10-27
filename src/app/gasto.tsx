import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DateField } from "@/components/DateField";
import { TextField } from "@/components/TextField";
import { CATEGORIES, getCategory, type CategoryId } from "@/data/categories";
import { useExpenses } from "@/data/expense-store";
import { lightImpact } from "@/lib/haptics";
import { formatMoney } from "@/lib/money";
import { validateExpenseForm, type FormErrors } from "@/lib/validation";
import { useTheme } from "@/theme/theme";

export default function ExpenseFormScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getById, add, update, remove, loading } = useExpenses();
  const existing = id ? getById(id) : undefined;
  const editing = Boolean(id);

  const [amountText, setAmountText] = useState("");
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date());
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const maxDate = useRef(new Date()).current;
  const loaded = useRef(false);

  // Al editar, rellena el formulario una sola vez cuando el gasto está disponible.
  useEffect(() => {
    if (existing && !loaded.current) {
      loaded.current = true;
      setAmountText(String(existing.amount));
      setCategoryId(existing.categoryId);
      setNote(existing.note);
      setDate(new Date(existing.date));
    }
  }, [existing]);

  // Al corregir un campo se quita su error sin esperar al siguiente envío.
  const clearError = (field: keyof FormErrors) => setErrors((e) => ({ ...e, [field]: undefined }));

  const close = () => (router.canGoBack() ? router.back() : router.replace("/"));

  const submit = async () => {
    const result = validateExpenseForm({ amountText, categoryId, date }, new Date());
    setErrors(result.errors);
    setSubmitError(null);
    if (Object.keys(result.errors).length || result.amount === null || !categoryId) return;

    setSaving(true);
    try {
      const data = { amount: result.amount, categoryId, note, date: date.toISOString() };
      if (existing) await update(existing.id, data);
      else await add(data);
      lightImpact();
      close();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "No se pudo guardar el gasto.");
      setSaving(false);
    }
  };

  const title = editing ? "Editar gasto" : "Nuevo gasto";

  if (editing && !existing) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
        <Stack.Screen options={{ title }} />
        <Text className="text-center text-body text-muted">{loading ? "Cargando…" : "No encontramos este gasto."}</Text>
        {!loading ? <Button label="Volver" variant="secondary" onPress={close} /> : null}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <Stack.Screen options={{ title }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="w-full max-w-xl gap-6 self-center p-4 pb-12"
      >
        <TextField
          label="Monto"
          value={amountText}
          onChangeText={(t) => {
            setAmountText(t);
            clearError("amount");
          }}
          error={errors.amount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          inputMode="decimal"
          returnKeyType="done"
          autoFocus={!editing}
        />

        <View className="gap-2">
          <Text className="text-body font-medium text-foreground">Categoría</Text>
          <View accessibilityRole="radiogroup" accessibilityLabel="Categoría" className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                selected={categoryId === c.id}
                onPress={() => {
                  setCategoryId(c.id);
                  clearError("category");
                }}
                left={<Ionicons name={c.icon} size={18} color={categoryId === c.id ? colors["primary-foreground"] : c.color} />}
              />
            ))}
          </View>
          {errors.category ? (
            <Text accessibilityRole="alert" accessibilityLiveRegion="polite" className="text-footnote text-danger">
              {errors.category}
            </Text>
          ) : null}
        </View>

        <TextField
          label="Nota (opcional)"
          value={note}
          onChangeText={setNote}
          placeholder="Ej. Comida con amigos"
          maxLength={80}
          returnKeyType="done"
        />

        <DateField value={date} maxDate={maxDate} onChange={(d) => {
            setDate(d);
            clearError("date");
          }}
          error={errors.date}
        />

        {submitError ? (
          <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" className="text-body text-danger">
            {submitError}
          </Text>
        ) : null}

        <View className="gap-3">
          <Button label={editing ? "Guardar cambios" : "Guardar gasto"} onPress={submit} disabled={saving} />
          <Button label="Cancelar" variant="secondary" onPress={close} />
          {existing ? (
            <Button label="Borrar gasto" variant="outline-danger" icon="trash-outline" onPress={() => setConfirmingDelete(true)} />
          ) : null}
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={confirmingDelete}
        title="¿Borrar este gasto?"
        message={
          existing
            ? `Se borrará "${existing.note || getCategory(existing.categoryId).name}" por ${formatMoney(existing.amount)}. Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Borrar gasto"
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={async () => {
          if (existing) await remove(existing.id);
          close();
        }}
      />
    </KeyboardAvoidingView>
  );
}
