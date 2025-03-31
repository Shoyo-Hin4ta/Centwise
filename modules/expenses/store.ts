import { create } from "zustand";

// No need to import icons here since we're just using string types
import { Category, ExpenseSummary, TimeFrame } from "./types";
import { colors } from "../../theme/colors";

interface ExpenseState {
  // Data
  summaries: Record<TimeFrame, ExpenseSummary>;

  // Actions
  addExpense: (amount: number, categoryId: string, date: Date) => void;
  getExpenseSummary: (timeFrame: TimeFrame) => ExpenseSummary;

  // Loading state
  isLoading: boolean;
  error: string | null;
}

// This would normally come from an API or database
const mockCategoriesData: Record<TimeFrame, ExpenseSummary> = {
  week: {
    timeFrame: "week",
    totalAmount: 124.5,
    categories: [
      {
        id: "1",
        name: "Shopping",
        iconType: "shopping",
        amount: 35.5,
        percentage: 28,
        color: colors.anime.purple,
      },
      {
        id: "2",
        name: "Food",
        iconType: "food",
        amount: 26.2,
        percentage: 21,
        color: colors.anime.pink,
      },
      {
        id: "3",
        name: "Transport",
        iconType: "transport",
        amount: 18.75,
        percentage: 15,
        color: colors.anime.blue,
      },
      {
        id: "4",
        name: "Coffee",
        iconType: "coffee",
        amount: 12.45,
        percentage: 10,
        color: colors.anime.mint,
      },
      {
        id: "5",
        name: "Entertainment",
        iconType: "entertainment",
        amount: 15.0,
        percentage: 12,
        color: colors.anime.lavender,
      },
      {
        id: "6",
        name: "Other",
        iconType: "other",
        amount: 16.6,
        percentage: 14,
        color: "#9e9e9e",
      },
    ],
  },
  month: {
    timeFrame: "month",
    totalAmount: 450.75,
    categories: [
      {
        id: "1",
        name: "Shopping",
        iconType: "shopping",
        amount: 125.5,
        percentage: 28,
        color: colors.anime.purple,
      },
      {
        id: "2",
        name: "Food",
        iconType: "food",
        amount: 95.2,
        percentage: 21,
        color: colors.anime.pink,
      },
      {
        id: "3",
        name: "Transport",
        iconType: "transport",
        amount: 68.75,
        percentage: 15,
        color: colors.anime.blue,
      },
      {
        id: "4",
        name: "Coffee",
        iconType: "coffee",
        amount: 45.3,
        percentage: 10,
        color: colors.anime.mint,
      },
      {
        id: "5",
        name: "Entertainment",
        iconType: "entertainment",
        amount: 55.0,
        percentage: 12,
        color: colors.anime.lavender,
      },
      {
        id: "6",
        name: "Other",
        iconType: "other",
        amount: 61.0,
        percentage: 14,
        color: "#9e9e9e",
      },
    ],
  },
  year: {
    timeFrame: "year",
    totalAmount: 5420.25,
    categories: [
      {
        id: "1",
        name: "Shopping",
        iconType: "shopping",
        amount: 1625.5,
        percentage: 30,
        color: colors.anime.purple,
      },
      {
        id: "2",
        name: "Food",
        iconType: "food",
        amount: 1192.45,
        percentage: 22,
        color: colors.anime.pink,
      },
      {
        id: "3",
        name: "Transport",
        iconType: "transport",
        amount: 813.03,
        percentage: 15,
        color: colors.anime.blue,
      },
      {
        id: "4",
        name: "Coffee",
        iconType: "coffee",
        amount: 325.2,
        percentage: 6,
        color: colors.anime.mint,
      },
      {
        id: "5",
        name: "Entertainment",
        iconType: "entertainment",
        amount: 867.25,
        percentage: 16,
        color: colors.anime.lavender,
      },
      {
        id: "6",
        name: "Other",
        iconType: "other",
        amount: 596.82,
        percentage: 11,
        color: "#9e9e9e",
      },
    ],
  },
};

export const useExpensesStore = create<ExpenseState>((set, get) => ({
  summaries: mockCategoriesData,
  isLoading: false,
  error: null,

  addExpense: (amount, categoryId, date) => {
    // In a real application, this would call an API and then update the state
    // For now, we'll just log it
    console.log("Adding expense:", { amount, categoryId, date });

    // This is where we would update the summaries state
  },

  getExpenseSummary: (timeFrame) => {
    return get().summaries[timeFrame];
  },
}));
