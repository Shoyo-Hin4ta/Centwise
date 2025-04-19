import React, { useState } from "react";
import { View, SectionList, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft } from 'lucide-react-native'; // Import the left arrow icon
import { useExpensesStore } from "../modules/expenses/store";
import { TransactionItem } from "../components/TransactionItem";
import { useRouter } from "expo-router";
import { Transaction } from "../modules/expenses/types";
import { EditTransactionModal } from "../components/EditTransactionModal";
import { colors } from "../theme/colors";

export const TransactionsScreen: React.FC = () => {
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const transactions = useExpensesStore((s) => s.transactions);
  const getCategoryById = useExpensesStore((s) => s.getCategoryById);
  // Group transactions by date (you can implement a grouping util if needed)
  const grouped = transactions.reduce((acc: Record<string, Transaction[]>, tx: Transaction) => {
    const date = tx.date.toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);
  const sections = Object.keys(grouped).map((date) => ({
    title: date,
    data: grouped[date],
  }));
  const router = useRouter();
  return (
    <View className="flex-1 bg-white dark:bg-anime-dark-purple">
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft size={24} color="black" />
      </TouchableOpacity>
      <Text className="px-4 pt-4 text-2xl font-bold text-black dark:text-white">Transactions</Text>
    </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="px-4 py-2 font-bold text-lg text-black dark:text-white">{title}</Text>
        )}
        renderItem={({ item }) => (
          <TransactionItem
            description={item.description}
            amount={item.amount}
            date={item.date}
            category={getCategoryById(item.categoryId) || { id: item.categoryId, name: "Unknown", iconType: "other", color: "#9e9e9e" }}
            onPress={() => router.push(`/transaction/${item.id}`)}
          />
        )}
      />
      
      {/* Floating Action Button for adding new transactions */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddTransactionModal(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      
      {/* Add Transaction Modal */}
      <EditTransactionModal
        visible={showAddTransactionModal}
        transaction={{
          id: '',
          description: '',
          amount: 0,
          date: new Date(),
          categoryId: '1', // Default category
          paymentMethod: 'Cash' // Default payment method
        }}
        onSave={(newTransaction) => {
          // In a real app, you would add the transaction to the store
          console.log("New transaction:", newTransaction);
          setShowAddTransactionModal(false);
        }}
        onClose={() => setShowAddTransactionModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.anime.purple,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
  },
});
