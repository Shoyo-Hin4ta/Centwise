import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import { useRouter } from "expo-router";
import { Coffee, Bus, Film, Book, HelpCircle } from "lucide-react-native";

import { colors } from "../theme/colors";
import { Button } from "./ui/Button";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: "food" | "transport" | "entertainment" | "books" | "misc";
};

const transactions: Transaction[] = [
  {
    id: "1",
    description: "Starbucks",
    amount: 4.5,
    date: "Today, 10:30 AM",
    category: "food",
  },
  {
    id: "2",
    description: "Campus Bus",
    amount: 2.0,
    date: "Today, 9:15 AM",
    category: "transport",
  },
  {
    id: "3",
    description: "Movie Ticket",
    amount: 12.99,
    date: "Yesterday, 7:30 PM",
    category: "entertainment",
  },
  {
    id: "4",
    description: "Textbook",
    amount: 65.0,
    date: "Mar 10, 2:45 PM",
    category: "books",
  },
  {
    id: "5",
    description: "Phone Charger",
    amount: 15.99,
    date: "Mar 9, 11:20 AM",
    category: "misc",
  },
];

const getCategoryIcon = (category: Transaction["category"]) => {
  switch (category) {
    case "food":
      return <Coffee size={16} color={colors.anime.pink} />;
    case "transport":
      return <Bus size={16} color={colors.anime.blue} />;
    case "entertainment":
      return <Film size={16} color={colors.anime.purple} />;
    case "books":
      return <Book size={16} color={colors.anime.mint} />;
    case "misc":
      return <HelpCircle size={16} color={colors.anime.lavender} />;
  }
};

export function TransactionList() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <Button
          variant="link"
          onPress={() => router.push("/transactions")}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </Button>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {transactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles.transactionCard}
            onPress={() => router.push(`/transaction/${transaction.id}`)}
          >
            <View style={styles.transactionLeft}>
              <View style={styles.iconContainer}>{getCategoryIcon(transaction.category)}</View>
              <View>
                <Text style={styles.transactionName}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text style={styles.transactionAmount}>-${transaction.amount.toFixed(2)}</Text>
              <TouchableOpacity>
                <Text style={styles.changeCategory}>Change Category</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  viewAllButton: {
    height: "auto",
    padding: 0,
  },
  viewAllText: {
    color: colors.anime.purple,
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: `${colors.anime.lavender}30`,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: `${colors.anime.background}80`,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "500",
  },
  transactionDate: {
    fontSize: 12,
    color: colors.gray[500],
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  changeCategory: {
    fontSize: 12,
    color: colors.anime.purple,
    marginTop: 4,
  },
});
