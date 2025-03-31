import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Mic } from "lucide-react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
 

import { BottomNav } from "../components/BottomNav";
import { CardSelector } from "../components/CardSelector";
import { FinancialSummary } from "../components/FinancialSummary";
import { Header } from "../components/Header";
import { QuickInput } from "../components/QuickInput";
import { TransactionList } from "../components/TransactionList";
import { Button } from "../components/ui/Button";
import { colors } from "../theme/colors";

import type { Card } from "../components/CardChip";

export default function Home() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  const handleTransaction = (transaction: {
    description: string;
    amount: number;
    card: Card | null;
  }) => {
    console.log("Transaction submitted:", transaction);
    // In a real app, this would save the transaction to a database
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.inputSection}>
          <QuickInput selectedCard={selectedCard} onTransaction={handleTransaction} />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <Button style={styles.voiceButton}>
            <Mic size={16} color={colors.white} />
            <Text style={styles.voiceButtonText}>Voice Input</Text>
          </Button>

          {/* Card selector moved below voice input with more spacing */}
          <View style={styles.cardSelectorContainer}>
            <Text style={styles.cardSelectorLabel}>Daily Expense Mode</Text>
            <CardSelector onCardSelect={handleCardSelect} />
          </View>
        </View>

        <FinancialSummary />

        <View style={styles.transactionListContainer}>
          <TransactionList />
        </View>
      </View>
      <BottomNav />
    </View>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
  },
  inputSection: {
    gap: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[300],
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.gray[500],
  },
  voiceButton: {
    backgroundColor: colors.anime.pink,
  },
  voiceButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  cardSelectorContainer: {
    marginTop: 12,
    marginBottom: 4,
  },
  cardSelectorLabel: {
    fontSize: 14,
    color: colors.gray[500],
  },
  transactionListContainer: {
    flex: 1,
    marginTop: 16,
  },
});
