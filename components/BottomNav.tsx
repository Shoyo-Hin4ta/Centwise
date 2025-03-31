import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Home, PieChart, BarChart, Target } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../theme/colors";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  
  // Custom bottom padding for devices with small/no home indicator
  const defaultBottomPadding = 16;
  
  // Custom bottom padding for devices with larger home indicator
  // This will override the system insets.bottom when it's greater than defaultBottomPadding
  const largeIndicatorPadding = 24; // Adjust this value as needed
  
  // Calculate the final padding to use
  const getBottomPadding = () => {
    if (insets.bottom > defaultBottomPadding) {
      // Device has a home indicator - use our custom larger padding
      return largeIndicatorPadding;
    }
    // Device has small or no home indicator
    return defaultBottomPadding;
  };

  const getTabColor = (path: string) => {
    return pathname === path ? colors.anime.purple : colors.gray[500];
  };

  return (
    <View style={[styles.container, { paddingBottom: getBottomPadding() }]}>
      <TouchableOpacity style={styles.tab} onPress={() => router.push("/")}>
        <Home size={20} color={getTabColor("/")} />
        <Text style={[styles.tabText, { color: getTabColor("/") }]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => router.push("/dashboard")}>
        <BarChart size={20} color={getTabColor("/dashboard")} />
        <Text style={[styles.tabText, { color: getTabColor("/dashboard") }]}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => router.push("/categories")}>
        <PieChart size={20} color={getTabColor("/categories")} />
        <Text style={[styles.tabText, { color: getTabColor("/categories") }]}>Categories</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => router.push("/goals")}>
        <Target size={20} color={getTabColor("/goals")} />
        <Text style={[styles.tabText, { color: getTabColor("/goals") }]}>Goals</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: `${colors.anime.lavender}30`,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  tab: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});