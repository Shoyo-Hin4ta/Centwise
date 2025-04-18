export type IconType =
  | "shopping"
  | "food"
  | "transport"
  | "coffee"
  | "entertainment"
  | "other"
  | "home";

// Represents the definition of a category
export interface Category {
  id: string;
  name: string;
  iconType: IconType;
  color: string;
}

// Represents an individual transaction record
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Date; // Use Date object
  categoryId: string;
  paymentMethod: string;
}

// Represents a category within an expense summary (includes calculated fields)
export interface SummaryCategory extends Category {
  amount: number;
  percentage: number;
}

export type TimeFrame = "week" | "month" | "year" | "custom"; // Added "custom"

export interface ExpenseSummary {
  timeFrame: TimeFrame;
  totalAmount: number;
  categories: SummaryCategory[]; // Use the extended type here
}
