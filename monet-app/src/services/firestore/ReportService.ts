import { Transaction } from '@/src/models/Transaction';
import { TransactionService } from './TransactionService';
import { CategoryService } from './CategoryService';
import { 
  ReportData, 
  PeriodSummary, 
  CategoryExpense, 
  ChartData,
  PeriodType 
} from '@/src/models/Report';

export class ReportService {
  /**
   * Obtiene el reporte completo para un período
   */
  static async getReportData(
    userId: string, 
    period: PeriodType
  ): Promise<ReportData> {
    try {
      // Obtener transacciones del período
      const transactions = await this.getTransactionsByPeriod(userId, period);
      
      // Calcular resumen
      const summary = this.calculateSummary(transactions);
      
      // Calcular gastos por categoría
      const categoryExpenses = await this.calculateCategoryExpenses(
        userId, 
        transactions
      );
      
      // Generar datos para el gráfico
      const chartData = this.generateChartData(transactions, period);
      
      // Calcular promedios
      const { averageIncome, averageExpense } = this.calculateAverages(
        transactions, 
        period
      );

      return {
        summary,
        categoryExpenses,
        chartData,
        averageIncome,
        averageExpense,
      };
    } catch (error) {
      console.error('Error al obtener reporte:', error);
      throw error;
    }
  }

  /**
   * Obtiene transacciones según el período
   */
  private static async getTransactionsByPeriod(
    userId: string,
    period: PeriodType
  ): Promise<Transaction[]> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        // Última semana
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        // Mes actual
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        // Año actual
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const allTransactions = await TransactionService.getUserTransactions(
      userId,
      1000
    );

    // Filtrar por fecha
    return allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= now;
    });
  }

  /**
   * Calcula el resumen financiero
   */
  private static calculateSummary(
    transactions: Transaction[]
  ): PeriodSummary {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netCashFlow = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 
      ? Math.round((netCashFlow / totalIncome) * 100) 
      : 0;

    return {
      totalIncome,
      totalExpense,
      netCashFlow,
      savingsRate,
    };
  }

  /**
   * Calcula gastos por categoría
   */
  private static async calculateCategoryExpenses(
    userId: string,
    transactions: Transaction[]
  ): Promise<CategoryExpense[]> {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

    // Agrupar por categoría
    const categoryMap = new Map<string, number>();
    expenses.forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    // Obtener información de categorías
    const categories = await CategoryService.getAllCategories(userId);

    // Convertir a array y ordenar
    const categoryExpenses: CategoryExpense[] = Array.from(categoryMap.entries())
      .map(([category, amount]) => {
        const categoryInfo = categories.find(c => c.name === category);
        return {
          category,
          categoryName: categoryInfo?.displayName || category,
          amount,
          color: categoryInfo?.color || '#6B7280',
          percentage: totalExpense > 0 
            ? Math.round((amount / totalExpense) * 100) 
            : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return categoryExpenses;
  }

  /**
   * Genera datos para el gráfico
   */
  private static generateChartData(
    transactions: Transaction[],
    period: PeriodType
  ): ChartData[] {
    const now = new Date();
    const chartData: ChartData[] = [];

    if (period === 'week') {
      // Últimos 7 días
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayTransactions = transactions.filter(t => {
          const tDate = new Date(t.date);
          return tDate.toDateString() === date.toDateString();
        });

        chartData.push({
          label: date.toLocaleDateString('es-ES', { weekday: 'short' }),
          income: dayTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0),
          expense: dayTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0),
        });
      }
    } else if (period === 'month') {
      // Últimas 4 semanas
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        
        const weekTransactions = transactions.filter(t => {
          const tDate = new Date(t.date);
          return tDate >= weekStart && tDate < weekEnd;
        });

        chartData.push({
          label: `S${4 - i}`,
          income: weekTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0),
          expense: weekTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0),
        });
      }
    } else {
      // Últimos 12 meses
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthTransactions = transactions.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === date.getMonth() && 
                 tDate.getFullYear() === date.getFullYear();
        });

        chartData.push({
          label: date.toLocaleDateString('es-ES', { month: 'short' }),
          income: monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0),
          expense: monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0),
        });
      }
    }

    return chartData;
  }

  /**
   * Calcula promedios
   */
  private static calculateAverages(
    transactions: Transaction[],
    period: PeriodType
  ): { averageIncome: number; averageExpense: number } {
    const daysInPeriod = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const divisor = period === 'week' ? 7 : period === 'month' ? 4 : 12;

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      averageIncome: Math.round(totalIncome / divisor),
      averageExpense: Math.round(totalExpense / divisor),
    };
  }
}