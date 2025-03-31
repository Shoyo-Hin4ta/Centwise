export type IconType =
  | "shopping"
  | "food"
  | "transport"
  | "coffee"
  | "entertainment"
  | "other"
  | "home";

export interface Category {
  id: string;
  name: string;
  iconType: IconType;
  amount: number;
  percentage: number;
  color: string;
}

export type TimeFrame = "week" | "month" | "year";

export interface ExpenseSummary {
  timeFrame: TimeFrame;
  totalAmount: number;
  categories: Category[];
}
