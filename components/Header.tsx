// In your Header.tsx component
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Logo } from "./Logo";
import { colors } from "../theme/colors";

export function Header() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <Logo />
      <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/profile")}>
        <User size={20} color={colors.anime.purple} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  profileButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: `${colors.anime.lavender}10`,
    alignItems: "center",
    justifyContent: "center",
  },
});