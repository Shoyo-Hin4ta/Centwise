import { useCallback } from "react";

import { useExpensesStore } from "./store";
import { TimeFrame } from "./types";

export const useExpenseCategories = (timeFrame: TimeFrame = "month") => {
  const getExpenseSummary = useExpensesStore((state) => state.getExpenseSummary);
  const isLoading = useExpensesStore((state) => state.isLoading);
  const error = useExpensesStore((state) => state.error);

  const summary = getExpenseSummary(timeFrame);

  return {
    categories: summary.categories,
    totalAmount: summary.totalAmount,
    isLoading,
    error,
  };
};

export const useAddExpense = () => {
  const addExpense = useExpensesStore((state) => state.addExpense);

  const addNewExpense = useCallback(
    (amount: number, categoryId: string, date: Date = new Date()) => {
      return addExpense(amount, categoryId, date);
    },
    [addExpense]
  );

  return { addExpense: addNewExpense };
};
