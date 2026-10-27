import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { useTheme } from "@/theme/theme";

import { PressableScale } from "./Button";

/** Botón flotante "Agregar gasto". Colócalo como hijo directo de Screen. */
export function AddButton() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View pointerEvents="box-none" className="absolute bottom-4 left-0 right-0 items-end px-4">
      <PressableScale
        onPress={() => router.push("/gasto")}
        accessibilityRole="button"
        accessibilityLabel="Agregar gasto"
        accessibilityHint="Abre el formulario de nuevo gasto"
        className="min-h-14 flex-row items-center gap-2 rounded-full bg-primary px-5 shadow-lg"
      >
        <Ionicons name="add" size={24} color={colors["primary-foreground"]} />
        <Text className="text-body font-semibold text-primary-foreground">Agregar</Text>
      </PressableScale>
    </View>
  );
}
