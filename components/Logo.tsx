import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { JapaneseYen } from "lucide-react-native";

import { colors } from "../theme/colors";

export function Logo() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <JapaneseYen size={24} color={colors.anime.purple} />
        <View style={styles.dot} />
      </View>

      <View>
        <Text style={styles.logoText}>Cent-sei</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    position: "relative",
  },
  dot: {
    position: "absolute",
    top: -4,
    right: -4,
    height: 8,
    width: 8,
    backgroundColor: colors.anime.pink,
    borderRadius: 4,
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 20,
    // Creating a text gradient effect in React Native requires special handling
    // Here we're just using the purple color, but in a real app you might use a library like expo-linear-gradient
    color: colors.anime.purple,
  },
});
