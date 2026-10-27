import { Text, TextInput, View, type TextInputProps } from "react-native";

import { useTheme } from "@/theme/theme";

type Props = TextInputProps & {
  label: string;
  error?: string;
  /** Texto auxiliar bajo el campo. */
  help?: string;
};

export function TextField({ label, error, help, ...input }: Props) {
  const { colors } = useTheme();
  return (
    <View className="gap-2">
      <Text className="text-body font-medium text-foreground">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={help}
        aria-invalid={!!error}
        placeholderTextColor={colors.muted}
        {...input}
        className={`min-h-12 rounded-md border bg-surface px-4 text-body text-foreground ${
          error ? "border-danger" : "border-outline"
        }`}
      />
      {error ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" className="text-footnote text-danger">
          {error}
        </Text>
      ) : help ? (
        <Text className="text-footnote text-muted">{help}</Text>
      ) : null}
    </View>
  );
}
