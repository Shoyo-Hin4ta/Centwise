import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "theme/colors";

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: colors.appBackground }}>
      <Slot />
    </SafeAreaProvider>
  );
}
