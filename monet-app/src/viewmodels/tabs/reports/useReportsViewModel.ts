import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { AuthService } from '@/src/services/auth/AuthService';
import { ReportService } from '@/src/services/firestore/ReportService';
import { ReportData, PeriodType } from '@/src/models/Report';

export const useReportsViewModel = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('week');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUser = AuthService.getCurrentUser();

  /**
   * Carga los datos del reporte
   */
  const loadReportData = async () => {
    if (!currentUser) {
      console.log('No hay usuario autenticado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Cargando reporte para período:', selectedPeriod);
      
      const data = await ReportService.getReportData(
        currentUser.uid,
        selectedPeriod
      );
      
      console.log('Reporte cargado:', data);
      setReportData(data);
    } catch (error: any) {
      console.error('Error al cargar reporte:', error);
      Alert.alert(
        'Error',
        'No se pudo cargar el reporte. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambia el período seleccionado
   */
  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
  };

  /**
   * Obtiene el label del período
   */
  const getPeriodLabel = (period: PeriodType): string => {
    switch (period) {
      case 'week': return 'Semana';
      case 'month': return 'Mes';
      case 'year': return 'Año';
    }
  };

  /**
   * Obtiene el texto del promedio según el período
   */
  const getAverageText = (): string => {
    if (!reportData) return '';
    
    const periodLabel = selectedPeriod === 'week' 
      ? 'semanal' 
      : selectedPeriod === 'month' 
        ? 'mensual' 
        : 'anual';

    return `Promedio ${periodLabel}: +$${reportData.averageIncome.toLocaleString()} Ingresos, -$${reportData.averageExpense.toLocaleString()} Gastos`;
  };

  // Cargar datos cuando cambia el período
  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  return {
    // Estado
    selectedPeriod,
    reportData,
    loading,

    // Métodos
    handlePeriodChange,
    getPeriodLabel,
    getAverageText,
    refreshData: loadReportData,
  };
};