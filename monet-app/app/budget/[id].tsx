import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { BudgetService } from '@/src/services/firestore/BudgetService';
import { CategoryService } from '@/src/services/firestore/CategoryService';
import { AuthService } from '@/src/services/auth/AuthService';
import { Budget } from '@/src/models/Budget';
import { formatCurrency } from '@/src/utils/currency';

export default function BudgetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryColor, setCategoryColor] = useState<string>('#6B7280');
  const [spent, setSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    loadBudget();
  }, [id]);

  const loadBudget = async () => {
    if (!id || !currentUser) return;

    try {
      setLoading(true);

      // Obtener todos los presupuestos y buscar por ID
      const budgets = await BudgetService.getUserBudgets(currentUser.uid);
      const foundBudget = budgets.find((b) => b.id === id);

      if (foundBudget) {
        setBudget(foundBudget);

        // Obtener información de la categoría
        const category = await CategoryService.getCategoryByName(
          currentUser.uid,
          foundBudget.category
        );

        if (category) {
          setCategoryName(category.displayName);
          setCategoryColor(category.color);
        } else {
          setCategoryName(foundBudget.category);
        }

        // Calcular gasto actual
        const currentSpent = await (BudgetService as any).calculateSpentAmount(
          currentUser.uid,
          foundBudget
        );
        setSpent(currentSpent);
      } else {
        Alert.alert('Error', 'No se encontró el presupuesto');
        router.back();
      }
    } catch (error) {
      console.error('Error al cargar presupuesto:', error);
      Alert.alert('Error', 'No se pudo cargar el presupuesto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Presupuesto',
      '¿Estás seguro de que deseas eliminar este presupuesto? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    if (!budget?.id) return;

    try {
      setDeleting(true);
      await BudgetService.deleteBudget(budget.id);

      Alert.alert(
        '¡Eliminado!',
        'El presupuesto ha sido eliminado correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error al eliminar presupuesto:', error);
      Alert.alert('Error', 'No se pudo eliminar el presupuesto');
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    if (!budget) return;

    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    const remaining = budget.amount - spent;

    const message = `
📊 Presupuesto: ${categoryName}
💰 Límite: ${formatCurrency(budget.amount)}
💸 Gastado: ${formatCurrency(spent)} (${Math.round(percentage)}%)
💵 Disponible: ${formatCurrency(Math.max(remaining, 0))}
📝 Descripción: ${budget.description}
📅 Período: Mensual
    `.trim();

    try {
      await Share.share({
        message,
        title: 'Detalle de Presupuesto',
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getPercentage = () => {
    if (!budget) return 0;
    return budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  };

  const getProgressColor = () => {
    const percentage = getPercentage();
    if (percentage >= 100) return '#EF4444';
    if (percentage >= 80) return '#F59E0B';
    return '#10B981';
  };

  const getStatusText = () => {
    const percentage = getPercentage();
    if (percentage >= 100) return 'Presupuesto excedido';
    if (percentage >= 80) return 'Límite cercano';
    if (percentage >= 50) return 'En progreso';
    return 'En buen estado';
  };

  const getStatusIcon = () => {
    const percentage = getPercentage();
    if (percentage >= 100) return 'alert-circle';
    if (percentage >= 80) return 'warning';
    return 'checkmark-circle';
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
      </ThemedView>
    );
  }

  if (!budget) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorText}>Presupuesto no encontrado</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const percentage = getPercentage();
  const remaining = budget.amount - spent;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="close" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle</Text>
        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Icono y Categoría */}
        <View style={styles.iconSection}>
          <View
            style={[styles.iconContainer, { backgroundColor: categoryColor }]}
          >
          </View>
          <Text style={styles.categoryTitle}>{categoryName}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getProgressColor() + '20' },
            ]}
          >
            <Ionicons
              name={getStatusIcon()}
              size={16}
              color={getProgressColor()}
            />
            <Text style={[styles.statusText, { color: getProgressColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        {/* Progreso */}
        <View style={styles.progressSection}>
          <View style={styles.amountRow}>
            <View>
              <Text style={styles.amountLabel}>Gastado</Text>
              <Text
                style={[styles.amountValue, { color: getProgressColor() }]}
              >
                {formatCurrency(spent)}
              </Text>
            </View>
            <View style={styles.amountDivider} />
            <View style={styles.amountRight}>
              <Text style={styles.amountLabel}>Límite</Text>
              <Text style={styles.amountValue}>
                {formatCurrency(budget.amount)}
              </Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: ${Math.min(percentage, 100)}%,
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>

          <View style={styles.progressInfo}>
            <Text style={styles.progressPercentage}>
              {Math.round(percentage)}%
            </Text>
            <Text
              style={[
                styles.progressRemaining,
                { color: remaining >= 0 ? '#10B981' : '#EF4444' },
              ]}
            >
              {remaining >= 0
                ? ${formatCurrency(remaining)} disponible
                : ${formatCurrency(Math.abs(remaining))} excedido}
            </Text>
          </View>
        </View>

        {/* Detalles */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="document-text-outline" size={20} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Descripción</Text>
              <Text style={styles.detailValue}>{budget.description}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Período</Text>
              <Text style={styles.detailValue}>
                {budget.period === 'monthly'
                  ? 'Mensual'
                  : budget.period === 'weekly'
                  ? 'Semanal'
                  : 'Anual'}
              </Text>
            </View>
          </View>

          {budget.createdAt && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="add-circle-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Fecha de creación</Text>
                <Text style={styles.detailValue}>
                  {formatDate(budget.createdAt)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Estadísticas */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Estadísticas</Text>

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trending-up" size={24} color="#10B981" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Progreso</Text>
              <Text style={styles.statValue}>{Math.round(percentage)}%</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="wallet-outline" size={24} color="#3B82F6" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Disponible</Text>
              <Text style={[styles.statValue, { color: remaining >= 0 ? '#10B981' : '#EF4444' }]}>
                {formatCurrency(Math.max(remaining, 0))}
              </Text>
            </View>
          </View>

          {percentage > 100 && (
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="alert-circle" size={24} color="#EF4444" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Excedido en</Text>
                <Text style={[styles.statValue, { color: '#EF4444' }]}>
                  {formatCurrency(Math.abs(remaining))}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="calculator-outline" size={24} color="#F59E0B" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Promedio diario disponible</Text>
              <Text style={styles.statValue}>
                {formatCurrency(Math.max(remaining, 0) / 30)}
              </Text>
            </View>
          </View>
        </View>

        {/* Información Adicional */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Información Adicional</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID de Presupuesto</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {budget.id}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Usuario ID</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {budget.userId}
            </Text>
          </View>
        </View>

        {/* Botón Eliminar */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.deleteButtonText}>Eliminar Presupuesto</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 24,
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  iconSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconEmoji: {
    fontSize: 48,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  amountDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  amountRight: {
    alignItems: 'flex-end',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressRemaining: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 12,
    color: '#9CA3AF',
    flex: 1,
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 32,
  },
});