import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { colors } from "../theme/colors";

export type CardType = "credit" | "debit" | "cash";

export interface Card {
  id: string;
  name: string;
  type: CardType;
  lastFour?: string;
  color?: string;
  logo?: string;
  isDefault?: boolean;
}

interface CardChipProps {
  card: Card;
  isSelected: boolean;
  onSelect: (card: Card) => void;
  style?: object;
}

export function CardChip({ card, isSelected, onSelect, style }: CardChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected ? styles.selectedContainer : styles.unselectedContainer,
        style,
      ]}
      onPress={() => onSelect(card)}
    >
      {/* Card type indicator (C or D) - only show for credit/debit cards */}
      {card.type !== "cash" && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{card.type === "credit" ? "C" : "D"}</Text>
        </View>
      )}

      <Text style={[styles.name, isSelected ? styles.selectedText : styles.unselectedText]}>
        {card.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  selectedContainer: {
    backgroundColor: colors.anime.purple,
    borderColor: colors.anime.purple,
  },
  unselectedContainer: {
    backgroundColor: colors.white,
    borderColor: `${colors.anime.lavender}30`,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    height: 20,
    width: 20,
    backgroundColor: colors.anime.pink,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  name: {
    fontSize: 12,
    fontWeight: "500",
  },
  selectedText: {
    color: colors.white,
  },
  unselectedText: {
    color: colors.gray[900],
  },
});
