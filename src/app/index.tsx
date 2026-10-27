import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-950 px-6">
      <Text className="text-4xl font-bold text-white">LadingPage</Text>
      <Text className="mt-3 text-center text-base text-slate-400">
        Expo + Expo Router + NativeWind
      </Text>
    </View>
  );
}
