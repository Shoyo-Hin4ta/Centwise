import { create } from "zustand";
import { Category, ExpenseSummary, TimeFrame, Transaction } from "./types"; // Added Transaction type
import { colors } from "../../theme/colors";

// --- Centralized Mock Data ---

// Define categories - Single source of truth for category details
const categoriesData: Category[] = [
  { id: "1", name: "Shopping", iconType: "shopping", color: colors.anime.purple },
  { id: "2", name: "Food", iconType: "food", color: colors.anime.pink },
  { id: "3", name: "Transport", iconType: "transport", color: colors.anime.blue },
  { id: "4", name: "Coffee", iconType: "coffee", color: colors.anime.mint },
  { id: "5", name: "Entertainment", iconType: "entertainment", color: colors.anime.lavender },
  { id: "6", name: "Other", iconType: "other", color: "#9e9e9e" },
  // Add Home if needed, ensure consistency
  { id: "7", name: "Home", iconType: "home", color: colors.gray[400] }, 
];

// Define all transactions - Single source of truth for transaction data
// Combining data previously in index.tsx and store.ts's getExpenseSummary
const allTransactionsData: Transaction[] = [
  // Data previously in index.tsx (with corrected dates/structure)
  { id: "1", description: "Starbucks", amount: 4.5, date: new Date("2025-03-20T10:30:00"), categoryId: "4", paymentMethod: "Chase Sapphire" },
  { id: "2", description: "Campus Bus", amount: 2.0, date: new Date("2025-03-20T09:15:00"), categoryId: "3", paymentMethod: "Cash" },
  { id: "3", description: "Movie Ticket", amount: 12.99, date: new Date("2025-03-19T19:30:00"), categoryId: "5", paymentMethod: "Amex Gold" },
  { id: "4", description: "Textbook", amount: 65.0, date: new Date("2025-03-10T14:45:00"), categoryId: "6", paymentMethod: "Bank of America" },
  { id: "5", description: "Phone Charger", amount: 15.99, date: new Date("2025-03-09T11:20:00"), categoryId: "1", paymentMethod: "Cash" },
  { id: "6", description: "Pizza", amount: 8.99, date: new Date("2025-03-08T18:30:00"), categoryId: "2", paymentMethod: "Chase Sapphire" },
  { id: "7", description: "Coffee Shop", amount: 5.25, date: new Date("2025-03-07T11:30:00"), categoryId: "4", paymentMethod: "Cash" },
  { id: "8", description: "Uber", amount: 12.5, date: new Date("2025-03-06T20:45:00"), categoryId: "3", paymentMethod: "Amex Gold" },
  { id: "9", description: "Concert Tickets", amount: 45.0, date: new Date("2025-03-05T14:15:00"), categoryId: "5", paymentMethod: "Chase Sapphire" },
  { id: "10", description: "Study Guide", amount: 18.99, date: new Date("2025-03-04T16:30:00"), categoryId: "6", paymentMethod: "Bank of America" },
  { id: "11", description: "Groceries", amount: 75.50, date: new Date("2025-04-16T17:00:00"), categoryId: "2", paymentMethod: "Chase Sapphire" },
  { id: "12", description: "Gas", amount: 40.00, date: new Date("2025-04-15T08:30:00"), categoryId: "3", paymentMethod: "Bank of America" },
  { id: "13", description: "Lunch", amount: 14.20, date: new Date("2025-04-14T12:15:00"), categoryId: "2", paymentMethod: "Cash" },
  { id: "14", description: "Online Course", amount: 99.00, date: new Date("2025-04-12T10:00:00"), categoryId: "6", paymentMethod: "Amex Gold" },
  { id: "15", description: "New Shoes", amount: 60.00, date: new Date("2025-04-10T15:45:00"), categoryId: "1", paymentMethod: "Chase Sapphire" },
  { id: "16", description: "Dinner Out", amount: 55.75, date: new Date("2025-04-05T19:00:00"), categoryId: "2", paymentMethod: "Amex Gold" },
  { id: "17", description: "Coffee", amount: 3.75, date: new Date("2025-04-02T09:00:00"), categoryId: "4", paymentMethod: "Cash" },
  // Data previously added inside getExpenseSummary (Apr 18) - Correcting date format
  { id: "18", description: "Breakfast", amount: 25.00, categoryId: "2", date: new Date("2025-04-18T08:00:00"), paymentMethod: "Cash" }, // Apr 18
  { id: "19", description: "Latte", amount: 5.50, categoryId: "4", date: new Date("2025-04-18T09:30:00"), paymentMethod: "Chase Sapphire" }, // Apr 18
  // --- Adding 3 new transactions for Apr 18, 2025 - Correcting date format ---
  { id: "20", description: "Morning Coffee", amount: 4.75, categoryId: "4", date: new Date("2025-04-18T08:30:00"), paymentMethod: "Cash" },
  { id: "21", description: "Team Lunch", amount: 22.50, categoryId: "2", date: new Date("2025-04-18T12:45:00"), paymentMethod: "Chase Sapphire" },
  { id: "22", description: "Bus Fare Home", amount: 2.00, categoryId: "3", date: new Date("2025-04-18T17:15:00"), paymentMethod: "Cash" },
  // --- End Added Mock Data ---
  // Add more mock data if needed, ensuring unique IDs and consistent structure
];

// --- Zustand Store Definition ---

interface ExpenseState {
  // Data
  transactions: Transaction[];
  categories: Category[]; // Store category definitions

  // Actions
  addExpense: (newExpense: Omit<Transaction, 'id'>) => void; // Simplified addExpense
  getExpenseSummary: (timeFrame: TimeFrame, customStartDate?: Date | null, customEndDate?: Date | null) => ExpenseSummary; 

  // Selectors (added for convenience)
  getAllTransactions: () => Transaction[];
  getCategoryById: (id: string) => Category | undefined;

  // Loading state (can be expanded later)
  isLoading: boolean;
  error: string | null;
}

export const useExpensesStore = create<ExpenseState>((set, get) => ({
  transactions: allTransactionsData,
  categories: categoriesData,
  isLoading: false,
  error: null,

  addExpense: (newExpense) => {
    set((state) => ({
      transactions: [
        ...state.transactions,
        { 
          ...newExpense, 
          id: (state.transactions.length + 1).toString() // Simple ID generation for mock
        }
      ]
    }));
    console.log("Adding expense:", newExpense);
  },

  getAllTransactions: () => {
    return get().transactions;
  },

  getCategoryById: (id) => {
    return get().categories.find(cat => cat.id === id);
  },

  // Rewritten implementation to calculate summaries dynamically
  getExpenseSummary: (timeFrame, customStartDate, customEndDate) => {
    const allTransactions = get().transactions;
    const allCategories = get().categories;
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    const now = new Date(); // Use a consistent 'now' for calculations

    // 1. Determine Date Range based on timeFrame or custom dates
    if (timeFrame === 'custom') {
      // Keep endDate null if only startDate is provided for single day selection
      startDate = customStartDate ? new Date(customStartDate) : null;
      endDate = customEndDate ? new Date(customEndDate) : null; // Don't default endDate to startDate here

    } else if (timeFrame === 'week') {
      endDate = new Date(now);
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (timeFrame === 'month') {
      endDate = new Date(now);
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeFrame === 'year') {
      endDate = new Date(now);
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    // Set time boundaries using UTC for range comparisons
    if (startDate && endDate) { // Only set boundaries if it's a range
       startDate.setUTCHours(0, 0, 0, 0);
       endDate.setUTCHours(23, 59, 59, 999);
    } else if (startDate && !endDate) {
       // For single day, we don't need to set boundaries, just use the date components
    }


    // 2. Filter Transactions based on the calculated date range
    const filteredTransactions = allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date); // Ensure it's a Date object

      // Handle single date selection (endDate is null)
      if (timeFrame === 'custom' && startDate && !endDate) {
         // Compare UTC date components directly
         return (
            transactionDate.getUTCFullYear() === startDate.getUTCFullYear() && // Compare against the original startDate
            transactionDate.getUTCMonth() === startDate.getUTCMonth() &&
            transactionDate.getUTCDate() === startDate.getUTCDate()
         );
      }
      
      // Handle date range selection (endDate is not null)
      if (startDate && endDate) {
         // Use UTC-adjusted start/end boundaries for comparison
         return transactionDate >= startDate && transactionDate <= endDate;
      }

      // Fallback (should not happen with current logic)
      return false; 
    });

    // 3. Aggregate Filtered Transactions by Category
    const categoryTotals: Record<string, number> = {};
    filteredTransactions.forEach(transaction => {
      if (!categoryTotals[transaction.categoryId]) {
        categoryTotals[transaction.categoryId] = 0;
      }
      categoryTotals[transaction.categoryId] += transaction.amount;
    });

    // 4. Calculate Total Amount
    const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    // 5. Format Categories for Summary Output
    const summaryCategories = allCategories
      .map(category => ({
        ...category, // Include id, name, iconType, color
        amount: categoryTotals[category.id] || 0,
        percentage: totalAmount > 0 ? Math.round((categoryTotals[category.id] || 0) / totalAmount * 100) : 0
      }))
      .filter(category => category.amount > 0); // Only include categories with expenses in the period

    // 6. Return the dynamically calculated summary
    return {
      timeFrame, // Return the requested timeframe
      totalAmount,
      categories: summaryCategories
    };
  },
}));
