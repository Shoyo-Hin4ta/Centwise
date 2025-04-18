import { useCallback, useMemo } from "react"; // Keep only one import line

import { useExpensesStore } from "./store";
import { TimeFrame, Transaction } from "./types"; // Added Transaction type

// Updated hook to accept optional startDate and endDate
export const useExpenseCategories = (
  timeFrame: TimeFrame = "month", 
  startDate?: Date | null, 
  endDate?: Date | null
) => {
  const getExpenseSummary = useExpensesStore((state) => state.getExpenseSummary);
  const isLoading = useExpensesStore((state) => state.isLoading);
  const error = useExpensesStore((state) => state.error);

  // Use useMemo to recalculate summary only when dependencies change
  const summary = useMemo(() => {
    // Pass dates to the store function if they exist
    return getExpenseSummary(timeFrame, startDate, endDate); 
  }, [timeFrame, startDate, endDate, getExpenseSummary]);

  return {
    categories: summary.categories,
    totalAmount: summary.totalAmount,
    isLoading,
    error,
  };
};

export const useAddExpense = () => {
  const addExpenseAction = useExpensesStore((state) => state.addExpense);

  // Update hook to accept a single object argument matching the store action
  const addNewExpense = useCallback(
    (newExpenseData: Omit<Transaction, 'id'>) => {
      // Create the base object without the date initially
      const expenseBase = { ...newExpenseData };
      
      // Add the date property, using the provided date or defaulting to now
      const expenseToAdd = {
        ...expenseBase,
        date: newExpenseData.date instanceof Date ? newExpenseData.date : new Date(),
      };

      return addExpenseAction(expenseToAdd);
    },
    [addExpenseAction]
  );

  return { addExpense: addNewExpense }; // Keep the exported name consistent
};
