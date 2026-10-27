import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Platform, type ColorValue } from "react-native";

import { useTheme } from "@/theme/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

const icon =
  (active: IconName, inactive: IconName) =>
  ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Ionicons name={focused ? active : inactive} size={24} color={color as string} />
  );

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        // En web la barra mide 48 px y recortaba la etiqueta de 12 px; en móvil la altura la calcula la navegación (con área segura).
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          ...(Platform.OS === "web" ? { height: 72, paddingTop: 6, paddingBottom: 8 } : null),
        },
        tabBarLabelStyle: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio", tabBarIcon: icon("home", "home-outline") }} />
      <Tabs.Screen name="historial" options={{ title: "Historial", tabBarIcon: icon("receipt", "receipt-outline") }} />
      <Tabs.Screen name="ajustes" options={{ title: "Ajustes", tabBarIcon: icon("settings", "settings-outline") }} />
    </Tabs>
  );
}
