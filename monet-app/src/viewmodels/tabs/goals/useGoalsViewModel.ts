import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { AuthService } from '@/src/services/auth/AuthService';
import { GoalService } from '@/src/services/firestore/GoalService';
import { Goal } from '@/src/models/Goal';

interface GoalsSummary {
  totalSaved: number;
  totalTarget: number;
  overallProgress: number;
  remaining: number;
  completedGoals: number;
  activeGoals: number;
}

export const useGoalsViewModel = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<GoalsSummary>({
    totalSaved: 0,
    totalTarget: 0,
    overallProgress: 0,
    remaining: 0,
    completedGoals: 0,
    activeGoals: 0,
  });

  const currentUser = AuthService.getCurrentUser();

  /**
   * Calcula el resumen de todos los objetivos
   */
  const calculateSummary = (goalsList: Goal[]): GoalsSummary => {
    const totalSaved = goalsList.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const totalTarget = goalsList.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
    const remaining = totalTarget - totalSaved;
    const completedGoals = goalsList.filter(
      (goal) => goal.currentAmount >= goal.targetAmount
    ).length;
    const activeGoals = goalsList.filter(
      (goal) => goal.currentAmount < goal.targetAmount
    ).length;

    return {
      totalSaved,
      totalTarget,
      overallProgress,
      remaining,
      completedGoals,
      activeGoals,
    };
  };

  /**
   * Carga los objetivos del usuario
   */
  const loadGoals = async () => {
    if (!currentUser) {
      console.log('No hay usuario autenticado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userGoals = await GoalService.getUserGoals(currentUser.uid);
      setGoals(userGoals);
      setSummary(calculateSummary(userGoals));
    } catch (error: any) {
      console.error('Error al cargar objetivos:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los objetivos. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el cambio en la búsqueda
   */
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  /**
   * Navega a la pantalla de crear objetivo
   * const navigateToCreateGoal = () => {
    router.push('/goal/create-goal');
  };

   */
  
  /**
   * Navega al detalle de un objetivo
   * const navigateToGoalDetail = (goalId: string) => {
    router.push(`/goal/${goalId}`);
  };
   */
  

  /**
   * Calcula el porcentaje de progreso
   */
  const calculateProgress = (goal: Goal): number => {
    if (goal.targetAmount === 0) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  /**
   * Refresca los datos
   */
  const refreshData = () => {
    loadGoals();
  };

  // Cargar objetivos al montar el componente
  useEffect(() => {
    loadGoals();
  }, []);

  return {
    // Estado
    goals,
    searchQuery,
    loading,
    summary,

    // Métodos
    handleSearchChange,
    //navigateToCreateGoal,
    //navigateToGoalDetail,
    calculateProgress,
    refreshData,
  };
};