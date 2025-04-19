import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Coffee, Bus, Film, Book, HelpCircle, ShoppingCart, Home } from "lucide-react-native";

import { colors } from "../theme/colors";
import { useExpensesStore } from "../modules/expenses/store";
import { ChangeCategoryModal } from "./ChangeCategoryModal";
import { Transaction } from "../modules/expenses/types";

export function TransactionList() {
  const router = useRouter();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Get transactions and functions from the store - call all hooks at the top level
  const getAllTransactions = useExpensesStore((s) => s.getAllTransactions);
  const getCategoryById = useExpensesStore((s) => s.getCategoryById);
  const updateTransaction = useExpensesStore((s) => s.updateTransaction);
  const categories = useExpensesStore(s => s.categories);
  
  // Get only the top 4 most recent transactions to match the UI
  const recentTransactions = getAllTransactions()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);
    
  const getCategoryIcon = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    const iconType = category?.iconType || "other";
    
    switch (iconType) {
      case "food":
        return <Coffee size={16} color={colors.white} />;
      case "transport":
        return <Bus size={16} color={colors.white} />;
      case "entertainment":
        return <Film size={16} color={colors.white} />;
      case "shopping":
        return <ShoppingCart size={16} color={colors.white} />;
      case "coffee":
        return <Coffee size={16} color={colors.white} />;
      case "home":
        return <Home size={16} color={colors.white} />;
      default:
        return <HelpCircle size={16} color={colors.white} />;
    }
  };
  
  const handleCategoryChange = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCategoryModal(true);
  };

  const handleCategorySelect = (categoryId: string) => {
    if (selectedTransaction) {
      // Update the transaction with the new category
      updateTransaction({
        ...selectedTransaction,
        categoryId
      });
    }
    setShowCategoryModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => router.push("/transactions")}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {recentTransactions.map((transaction) => {
          const category = getCategoryById(transaction.categoryId);
          return (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionCard}
              onPress={() => router.push(`/transaction/${transaction.id}`)}
            >
              <View style={styles.transactionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: category?.color || colors.anime.background }]}>
                  {getCategoryIcon(transaction.categoryId)}
                </View>
                <View>
                  <Text style={styles.transactionName}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleString(undefined, { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>-${transaction.amount.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => handleCategoryChange(transaction)}>
                  <Text style={styles.changeCategory}>Change Category</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {/* Category Modal */}
      <ChangeCategoryModal
        visible={showCategoryModal}
        categories={categories}
        currentCategoryId={selectedTransaction?.categoryId || ""}
        onSelect={handleCategorySelect}
        onClose={() => setShowCategoryModal(false)}
      />
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
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
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