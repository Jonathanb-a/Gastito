import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-4xl font-bold text-foreground">LadingPage</Text>
      <Text className="mt-3 text-center text-base text-muted">
        Expo + Expo Router + NativeWind
      </Text>
    </View>
  );
}
