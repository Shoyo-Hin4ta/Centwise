import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import { Plus } from "lucide-react-native";

import { CardChip, Card } from "./CardChip";
import { colors } from "../theme/colors";
import { AddCardModal } from "./AddCardModal";

// Default cards
const defaultCards: Card[] = [
  {
    id: "cash",
    name: "Cash",
    type: "cash",
    isDefault: true,
  },
  {
    id: "1",
    name: "Chase Sapphire",
    type: "credit",
    lastFour: "4567",
    color: "#1e4a86",
  },
  {
    id: "2",
    name: "Bank of America",
    type: "debit",
    lastFour: "8901",
    color: "#e31837",
  },
  {
    id: "3",
    name: "Amex Gold",
    type: "credit",
    lastFour: "3456",
    color: "#f8d57e",
  },
];

interface CardSelectorProps {
  onCardSelect: (card: Card) => void;
}

export function CardSelector({ onCardSelect }: CardSelectorProps) {
  // Find the default card (Cash)
  const defaultCard = defaultCards.find((card) => card.isDefault) || defaultCards[0];

  const [cards, setCards] = useState<Card[]>(defaultCards);
  const [selectedCard, setSelectedCard] = useState<Card>(defaultCard);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    onCardSelect(card);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cards.map((card) => (
          <CardChip
            key={card.id}
            card={card}
            isSelected={selectedCard.id === card.id}
            onSelect={handleCardSelect}
          />
        ))}

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddCardModal(true)}
        >
          <Plus size={14} color={colors.anime.purple} />
        </TouchableOpacity>
      </ScrollView>
      
      <AddCardModal
        visible={showAddCardModal}
        onAddCard={(newCard) => {
          // In a real app, you would add the card to the store
          console.log("New card:", newCard);
          // For demo purposes, add it to the local state
          setCards([...cards, newCard]);
          setShowAddCardModal(false);
        }}
        onClose={() => setShowAddCardModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 4,
    paddingBottom: 8,
  },
  scrollContent: {
    flexDirection: "row",
    paddingVertical: 8,
    gap: 12,
  },
  addButton: {
    height: 36,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: `${colors.anime.lavender}50`,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
});
