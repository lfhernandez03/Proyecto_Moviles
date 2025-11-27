import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { AuthService } from '@/src/services/auth/AuthService';
import { BudgetService } from '@/src/services/firestore/BudgetService';
import { Budget, BudgetSummary } from '@/src/models/Budget';

export const useBudgetViewModel = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<BudgetSummary>({
    totalBudget: 0,
    totalSpent: 0,
    remainingBudget: 0,
    percentage: 0,
    categoriesOverBudget: 0,
  });

  const currentUser = AuthService.getCurrentUser();

  /**
   * Carga los presupuestos del usuario
   */
  const loadBudgets = async () => {
    if (!currentUser) {
      console.log('No hay usuario autenticado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Cargando presupuestos para usuario:', currentUser.uid);
      
      const userBudgets = await BudgetService.getUserBudgets(currentUser.uid);
      
      console.log('Presupuestos cargados:', userBudgets.length);
      setBudgets(userBudgets);
      filterBudgets(userBudgets, searchQuery);
      calculateSummary(userBudgets);
    } catch (error: any) {
      console.error('Error al cargar presupuestos:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los presupuestos. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtra los presupuestos según la búsqueda
   */
  const filterBudgets = (budgetsList: Budget[], search: string) => {
    if (search.trim()) {
      const filtered = budgetsList.filter(b =>
        b.categoryName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredBudgets(filtered);
    } else {
      setFilteredBudgets(budgetsList);
    }
  };

  /**
   * Calcula el resumen de presupuestos
   */
  const calculateSummary = (budgetsList: Budget[]) => {
    const totalBudget = budgetsList.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgetsList.reduce((sum, b) => sum + b.spent, 0);
    const remainingBudget = totalBudget - totalSpent;
    const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const categoriesOverBudget = budgetsList.filter(b => b.spent > b.amount).length;

    setSummary({
      totalBudget,
      totalSpent,
      remainingBudget,
      percentage,
      categoriesOverBudget,
    });
  };

  /**
   * Maneja el cambio de búsqueda
   */
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    filterBudgets(budgets, query);
  };

  /**
   * Navega a crear presupuesto
   */
  const navigateToCreateBudget = () => {
    router.push('/budget/create-budget');
  };

  /**
   * Navega al detalle de presupuesto
   */
  const navigateToBudgetDetail = (budgetId: string) => {
    router.push({
      pathname: '/budget/[id]',
      params: { id: budgetId },
    });
  };

  /**
   * Calcula el porcentaje usado del presupuesto
   */
  const calculatePercentage = (spent: number, budget: number): number => {
    return budget > 0 ? Math.round((spent / budget) * 100) : 0;
  };

  /**
   * Obtiene el color según el porcentaje
   */
  const getPercentageColor = (percentage: number): string => {
    if (percentage >= 100) return '#EF4444'; // Rojo
    if (percentage >= 80) return '#F59E0B'; // Amarillo
    return '#10B981'; // Verde
  };

  /**
   * Verifica si el presupuesto está excedido
   */
  const isOverBudget = (spent: number, budget: number): boolean => {
    return spent > budget;
  };

  /**
   * Calcula el monto excedido
   */
  const getOverBudgetAmount = (spent: number, budget: number): number => {
    return Math.max(0, spent - budget);
  };

  // Cargar presupuestos al montar
  useEffect(() => {
    loadBudgets();
  }, []);

  return {
    // Estado
    budgets,
    filteredBudgets,
    searchQuery,
    loading,
    summary,

    // Métodos
    handleSearchChange,
    navigateToCreateBudget,
    navigateToBudgetDetail,
    calculatePercentage,
    getPercentageColor,
    isOverBudget,
    getOverBudgetAmount,
    refreshData: loadBudgets,
  };
};