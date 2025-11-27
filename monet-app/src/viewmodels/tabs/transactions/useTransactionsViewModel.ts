import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { AuthService } from '@/src/services/auth/AuthService';
import { TransactionService } from '@/src/services/firestore/TransactionService';
import { Transaction } from '@/src/models/Transaction';

type TabType = 'Todas' | 'Ingresos' | 'Gastos';

export const useTransactionsViewModel = () => {
  const params = useLocalSearchParams<{ type?: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabType>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const currentUser = AuthService.getCurrentUser();

  /**
   * Carga las transacciones del usuario
   */
  const loadTransactions = async () => {
    if (!currentUser) {
      console.log('No hay usuario autenticado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const userTransactions = await TransactionService.getUserTransactions(
        currentUser.uid,
        50
      );
      
      console.log('Transacciones cargadas:', userTransactions.length);
      setTransactions(userTransactions);
      filterTransactions(userTransactions, selectedTab, searchQuery);
    } catch (error: any) {
      console.error('Error al cargar transacciones:', error);
      
      // Mostrar mensaje de error específico
      if (error.code === 'permission-denied') {
        Alert.alert(
          'Error de permisos',
          'No tienes permisos para acceder a las transacciones. Por favor, verifica la configuración de Firestore.'
        );
      } else {
        Alert.alert(
          'Error',
          'No se pudieron cargar las transacciones. Intenta de nuevo.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtra las transacciones según tab y búsqueda
   */
  const filterTransactions = (
    transactionsList: Transaction[],
    tab: TabType,
    search: string
  ) => {
    let filtered = transactionsList;

    // Filtrar por tab
    if (tab === 'Ingresos') {
      filtered = filtered.filter(t => t.type === 'income');
    } else if (tab === 'Gastos') {
      filtered = filtered.filter(t => t.type === 'expense');
    }

    // Filtrar por búsqueda
    if (search.trim()) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  /**
   * Maneja el cambio de tab
   */
  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
    filterTransactions(transactions, tab, searchQuery);
  };

  /**
   * Maneja el cambio de búsqueda
   */
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    filterTransactions(transactions, selectedTab, query);
  };

  /**
   * Navega a agregar transacción
   */
  const navigateToAddTransaction = () => {
    router.push('/transaction/add-transaction');
  };

  /**
   * Navega al detalle de transacción
   */
  const navigateToTransactionDetail = (transactionId: string) => {
    router.push({
      pathname: '/transaction/[id]',
      params: { id: transactionId },
    });
  };

  /**
   * Obtiene el color de fondo del ícono según categoría
   */
  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      food: '#FEF3C7',
      transport: '#DBEAFE',
      entertainment: '#E0E7FF',
      shopping: '#FCE7F3',
      bills: '#FED7AA',
      salary: '#D1FAE5',
      health: '#FECACA',
      other: '#E5E7EB',
    };
    return colors[category] || '#E5E7EB';
  };

  /**
   * Formatea la fecha de forma relativa
   */
  const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    if (diffDays <= 14) return 'Hace 1 semana';
    if (diffDays <= 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Cargar transacciones al montar
  useEffect(() => {
    loadTransactions();
  }, []);

  // Si viene desde home con tipo específico, cambiar tab
  useEffect(() => {
    if (params.type === 'income') {
      handleTabChange('Ingresos');
    } else if (params.type === 'expense') {
      handleTabChange('Gastos');
    }
  }, [params.type]);

  return {
    // Estado
    transactions,
    filteredTransactions,
    selectedTab,
    searchQuery,
    loading,

    // Métodos
    handleTabChange,
    handleSearchChange,
    navigateToAddTransaction,
    navigateToTransactionDetail,
    getCategoryColor,
    formatRelativeDate,
    refreshData: loadTransactions,
  };
};