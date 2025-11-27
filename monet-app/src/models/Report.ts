export interface PeriodSummary {
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  savingsRate: number;
}

export interface CategoryExpense {
  category: string;
  categoryName: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface ChartData {
  label: string;
  income: number;
  expense: number;
}

export interface ReportData {
  summary: PeriodSummary;
  categoryExpenses: CategoryExpense[];
  chartData: ChartData[];
  averageIncome: number;
  averageExpense: number;
}

export type PeriodType = 'week' | 'month' | 'year';