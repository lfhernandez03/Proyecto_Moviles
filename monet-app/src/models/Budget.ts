export interface Budget {
  id: string;
  userId: string;
  category: string;
  categoryName: string;
  amount: number;
  spent: number;
  color: string;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  percentage: number;
  categoriesOverBudget: number;
}