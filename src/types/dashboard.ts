export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  totalTransactions: number;
}

export interface CategoryItem {
  category: string;
  total: number;
  count: number;
}

export interface CategoryBreakdown {
  type: string;
  categories: CategoryItem[];
  grandTotal: number;
}

export interface TrendDataItem {
  year: number;
  month: number;
  income: number;
  expense: number;
  net: number;
  transactionCount: number;
}
