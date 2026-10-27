import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { getCategory, type CategoryId } from "@/data/categories";

/** Icono de categoría sobre un círculo tintado. Decorativo: el nombre siempre va en texto. */
export function CategoryIcon({ categoryId, size = 40 }: { categoryId: CategoryId; size?: number }) {
  const c = getCategory(categoryId);
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: `${c.color}26` }}
      className="items-center justify-center"
    >
      <Ionicons name={c.icon} size={size * 0.5} color={c.color} />
    </View>
  );
}
