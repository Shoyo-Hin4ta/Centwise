import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Category } from "../modules/expenses/types";
import { colors } from "../theme/colors";
import { ChangeCategoryModal } from "./ChangeCategoryModal";
import { useExpensesStore } from "../modules/expenses/store";

interface TransactionItemProps {
  description: string;
  amount: number;
  date: Date;
  category: Category;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  description,
  amount,
  date,
  category,
  onPress,
}) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  return (
    <TouchableOpacity
      className="flex-row justify-between items-center p-4 bg-white dark:bg-anime-dark-purple rounded-xl shadow-sm border border-anime-lavender/30 mb-3"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-12 w-12 rounded-full items-center justify-center"
          style={{ backgroundColor: category.color }}
        >
          {/* Icon component here */}
        </View>
        <View>
          <Text className="font-medium text-lg text-black dark:text-white">
            {description}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {date.toLocaleString()}
          </Text>
        </View>
      </View>
      <View className="flex-col items-end">
        <Text className="font-bold text-xl text-black dark:text-white">
          -${amount.toFixed(2)}
        </Text>
        <TouchableOpacity onPress={() => setShowCategoryModal(true)}>
          <Text className="text-xs text-anime-purple">Change Category</Text>
        </TouchableOpacity>
      </View>
      
      <ChangeCategoryModal
        visible={showCategoryModal}
        categories={useExpensesStore(s => s.categories)}
        currentCategoryId={category.id}
        onSelect={(categoryId) => {
          // In a real app, you would update the category in the store
          console.log("Selected category:", categoryId);
          setShowCategoryModal(false);
        }}
        onClose={() => setShowCategoryModal(false)}
      />
    </TouchableOpacity>
  );
};
