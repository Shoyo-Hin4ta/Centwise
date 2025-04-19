import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Edit, Trash, Coffee, Bus, Film, Book, HelpCircle, ShoppingCart, Home } from "lucide-react-native";
import { useExpensesStore } from "../modules/expenses/store";
import { EditTransactionModal } from "../components/EditTransactionModal";
import { ChangeCategoryModal } from "../components/ChangeCategoryModal";
import { colors } from "../theme/colors";

export const TransactionDetailScreen: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const transaction = useExpensesStore((s) => s.transactions.find((t) => t.id === id));
  const getCategoryById = useExpensesStore((s) => s.getCategoryById);
  
  if (!transaction) return <Text>Transaction not found</Text>;
  
  const category = getCategoryById(transaction.categoryId);
  
  // Function to get the appropriate icon based on category type
  const getCategoryIcon = (iconType: string) => {
    switch (iconType) {
      case "food":
        return <Coffee size={20} color="white" />;
      case "transport":
        return <Bus size={20} color="white" />;
      case "entertainment":
        return <Film size={20} color="white" />;
      case "shopping":
        return <ShoppingCart size={20} color="white" />;
      case "coffee":
        return <Coffee size={20} color="white" />;
      case "home":
        return <Home size={20} color="white" />;
      default:
        return <HelpCircle size={20} color="white" />;
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric',
      year: 'numeric'
    }) + " at " + new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
      </View>
      
      {/* Transaction Card */}
      <View style={styles.card}>
        {/* Transaction Title and Amount */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{transaction.description}</Text>
          <Text style={styles.amount}>-${transaction.amount.toFixed(2)}</Text>
        </View>
        
        {/* Date */}
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        
        {/* Category */}
        <Text style={styles.sectionLabel}>Category</Text>
        <View style={styles.categoryRow}>
          <View style={[styles.categoryIcon, { backgroundColor: category?.color || "#9e9e9e" }]}>
            {getCategoryIcon(category?.iconType || "other")}
          </View>
          <Text style={styles.categoryName}>{category?.name || "Unknown"}</Text>
        </View>
        
        {/* Payment Method */}
        <Text style={styles.sectionLabel}>Payment Method</Text>
        <Text style={styles.sectionValue}>{transaction.paymentMethod}</Text>
        
        {/* Notes - This would need to be added to your Transaction type */}
        <Text style={styles.sectionLabel}>Notes</Text>
        <Text style={styles.sectionValue}>{"Morning coffee before class"}</Text>
      </View>
      
      {/* Action Buttons */}
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => setShowEditModal(true)}
      >
        <Edit size={20} color="white" />
        <Text style={styles.editButtonText}>Edit Transaction</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.categoryButton}
        onPress={() => setShowCategoryModal(true)}
      >
        <Text style={styles.categoryButtonText}>Move to Different Category</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.deleteButton}>
        <Trash size={20} color="#e74c3c" />
        <Text style={styles.deleteButtonText}>Delete Transaction</Text>
      </TouchableOpacity>
      {/* Modals */}
      <EditTransactionModal
        visible={showEditModal}
        transaction={transaction}
        onSave={(updated) => {
          console.log("Updated transaction:", updated);
          setShowEditModal(false);
        }}
        onClose={() => setShowEditModal(false)}
      />
      
      <ChangeCategoryModal
        visible={showCategoryModal}
        categories={useExpensesStore(s => s.categories)}
        currentCategoryId={transaction.categoryId}
        onSelect={(categoryId) => {
          console.log("Selected category:", categoryId);
          setShowCategoryModal(false);
        }}
        onClose={() => setShowCategoryModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7ff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  amount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  date: {
    fontSize: 18,
    color: "#666",
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  sectionValue: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: colors.anime.purple,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: colors.anime.purple,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  categoryButtonText: {
    color: colors.anime.purple,
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e74c3c",
    borderRadius: 12,
    padding: 16,
  },
  deleteButtonText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
