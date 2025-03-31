import React from "react";
import { View, Text } from "react-native";

import { colors } from "../theme/colors";

export function FinancialSummary() {
  return (
    <View className="flex-row gap-3 w-full my-2">
      <View className="flex-1 bg-white rounded-xl p-3 items-center shadow-sm border border-gray-100">
        <Text className="text-xs text-gray-500 mb-1">This Week</Text>
        <Text className="text-lg font-bold" style={{ color: colors.anime.purple }}>
          $124.50
        </Text>
      </View>

      <View className="flex-1 bg-white rounded-xl p-3 items-center shadow-sm border border-gray-100">
        <Text className="text-xs text-gray-500 mb-1">This Month</Text>
        <Text className="text-lg font-bold" style={{ color: colors.anime.pink }}>
          $450.75
        </Text>
      </View>

      <View className="flex-1 bg-white rounded-xl p-3 items-center shadow-sm border border-gray-100">
        <Text className="text-xs text-gray-500 mb-1">Balance</Text>
        <Text className="text-lg font-bold" style={{ color: colors.anime.blue }}>
          $1,250.25
        </Text>
      </View>
    </View>
  );
}
