import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";

import {
  BarChart2,
  ShoppingBag,
  Coffee,
  Train,
  Utensils,
  Home,
  Film,
  Star,
} from "lucide-react-native";

import { useExpenseCategories } from "../modules/expenses";
import { IconType, TimeFrame } from "../modules/expenses/types";
import { colors } from "../theme/colors";

interface ExpenseCategoriesProps {
  initialTimeframe?: TimeFrame;
}

// Helper function to render the appropriate icon based on iconType
const renderCategoryIcon = (iconType: IconType) => {
  switch (iconType) {
    case "shopping":
      return <ShoppingBag size={16} color={colors.white} />;
    case "food":
      return <Utensils size={16} color={colors.white} />;
    case "transport":
      return <Train size={16} color={colors.white} />;
    case "coffee":
      return <Coffee size={16} color={colors.white} />;
    case "entertainment":
      return <Film size={16} color={colors.white} />;
    case "home":
      return <Home size={16} color={colors.white} />;
    case "other":
    default:
      return <Star size={16} color={colors.white} />;
  }
};

export function ExpenseCategories({ initialTimeframe = "month" }: ExpenseCategoriesProps) {
  const [activeTimeframe, setActiveTimeframe] = useState<TimeFrame>(initialTimeframe);
  const { categories, totalAmount, isLoading, error } = useExpenseCategories(activeTimeframe);

  if (isLoading) {
    return (
      <View className="mt-4 items-center justify-center py-6">
        <ActivityIndicator color={colors.anime.purple} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-4 bg-red-50 p-4 rounded-lg">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="mt-4">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <BarChart2 size={20} color={colors.anime.purple} />
          <Text className="ml-2 text-base font-medium text-gray-800">Expense Categories</Text>
        </View>

        <View className="flex-row bg-gray-100 rounded-full p-1">
          {(["week", "month", "year"] as const).map((option) => (
            <TouchableOpacity
              key={option}
              className={`px-3 py-1 rounded-full ${activeTimeframe === option ? "bg-white shadow" : ""}`}
              onPress={() => setActiveTimeframe(option)}
            >
              <Text
                className={`text-xs font-medium ${
                  activeTimeframe === option ? "text-anime-purple" : "text-gray-500"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
        {categories.map((category) => (
          <View
            key={category.id}
            className="mr-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm"
            style={{ width: 140 }}
          >
            <View className="flex-row items-center mb-2">
              <View
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{ backgroundColor: category.color }}
              >
                {renderCategoryIcon(category.iconType)}
              </View>
              <Text className="ml-2 text-sm font-medium text-gray-700">{category.name}</Text>
            </View>

            <View className="h-3 bg-gray-100 rounded-full w-full overflow-hidden mb-1">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: category.color,
                }}
              />
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-gray-500">{category.percentage}%</Text>
              <Text className="text-sm font-bold" style={{ color: category.color }}>
                ${category.amount.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
