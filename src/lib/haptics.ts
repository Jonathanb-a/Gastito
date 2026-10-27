import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/** Vibración ligera de confirmación. Solo en móvil; en web no hace nada. */
export function lightImpact() {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
