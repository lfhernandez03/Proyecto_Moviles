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
  TextInput,
  Modal,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { GoalService } from '@/src/services/firestore/GoalService';
import { AuthService } from '@/src/services/auth/AuthService';
import { Goal } from '@/src/models/Goal';
import { formatCurrency } from '@/src/utils/currency';
const NotificationHelper = {
  checkGoalDeadlines: async (_userId: string) => {
    // notification helper module is not available in this environment; noop to avoid compile error
    return Promise.resolve();
  },
};

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [addingFunds, setAddingFunds] = useState(false);

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    loadGoal();
  }, [id]);

  const loadGoal = async () => {
    if (!id || !currentUser) return;

    try {
      setLoading(true);

      const goals = await GoalService.getUserGoals(currentUser.uid);
      const foundGoal = goals.find((g) => g.id === id);

      if (foundGoal) {
        setGoal(foundGoal);
      } else {
        Alert.alert('Error', 'No se encontró el objetivo');
        router.back();
      }
    } catch (error) {
      console.error('Error al cargar objetivo:', error);
      Alert.alert('Error', 'No se pudo cargar el objetivo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Objetivo',
      '¿Estás seguro de que deseas eliminar este objetivo? Esta acción no se puede deshacer.',
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
    if (!goal?.id) return;

    try {
      setDeleting(true);
      await GoalService.deleteGoal(goal.id);

      Alert.alert('¡Eliminado!', 'El objetivo ha sido eliminado correctamente', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error al eliminar objetivo:', error);
      Alert.alert('Error', 'No se pudo eliminar el objetivo');
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    if (!goal) return;

    const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    const remaining = goal.targetAmount - goal.currentAmount;

    const message = `
    Objetivo: ${goal.title}
    ${goal.description}
    Meta: ${formatCurrency(goal.targetAmount)}
    Ahorrado: ${formatCurrency(goal.currentAmount)} (${Math.round(percentage)}%)
    Por ahorrar: ${formatCurrency(Math.max(remaining, 0))}
${goal.deadline ? `📅 Fecha límite: ${new Date(goal.deadline).toLocaleDateString('es-ES')}` : ''}
    `.trim();

    try {
      await Share.share({
        message,
        title: 'Mi Objetivo Financiero',
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  const handleAddFunds = () => {
    setFundAmount('');
    setShowAddFundsModal(true);
  };

  const confirmAddFunds = async () => {
    if (!goal?.id) return;

    const amount = parseFloat(fundAmount);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    try {
      setAddingFunds(true);
      await GoalService.addFunds(goal.id, amount);
      
      setShowAddFundsModal(false);
      setFundAmount('');
      
      // Recargar objetivo
      await loadGoal();

      // Verificar notificaciones de plazos y completado
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        NotificationHelper.checkGoalDeadlines(currentUser.uid).catch((error: Error) => {
          console.error('Error al verificar plazos:', error);
        });
      }

      Alert.alert('¡Éxito!', `Se han agregado ${formatCurrency(amount)} a tu objetivo`);
    } catch (error) {
      console.error('Error al agregar fondos:', error);
      Alert.alert('Error', 'No se pudieron agregar los fondos');
    } finally {
      setAddingFunds(false);
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
    if (!goal) return 0;
    return goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  };

  const getProgressColor = () => {
    const percentage = getPercentage();
    if (percentage >= 100) return '#10B981';
    if (percentage >= 75) return '#3B82F6';
    if (percentage >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const isCompleted = goal && goal.currentAmount >= goal.targetAmount;
  const remaining = goal ? goal.targetAmount - goal.currentAmount : 0;
  const daysRemaining = goal?.deadline 
    ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

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

  if (!goal) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorText}>Objetivo no encontrado</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

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
        {/* Icon and Title */}
        <View style={styles.iconSection}>
          <View style={[styles.iconContainer, isCompleted && styles.iconContainerCompleted]}>
            <Text style={styles.iconEmoji}>{goal.icon || '🎯'}</Text>
          </View>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.completedBadgeText}>¡Objetivo Completado!</Text>
            </View>
          )}
        </View>

        {/* Title and Description */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={styles.description}>{goal.description}</Text>
        </View>

        {/* Progress Section */}
        <View style={styles.progressCard}>
          <View style={styles.amountRow}>
            <View>
              <Text style={styles.amountLabel}>Ahorrado</Text>
              <Text style={[styles.amountValue, { color: getProgressColor() }]}>
                {formatCurrency(goal.currentAmount)}
              </Text>
            </View>
            <View style={styles.amountDivider} />
            <View style={styles.amountRight}>
              <Text style={styles.amountLabel}>Meta</Text>
              <Text style={styles.amountValue}>{formatCurrency(goal.targetAmount)}</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.min(getPercentage(), 100)}%`,
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>

          <View style={styles.progressInfo}>
            <Text style={styles.progressPercentage}>{Math.round(getPercentage())}%</Text>
            <Text style={[styles.progressRemaining, { color: remaining >= 0 ? '#6B7280' : '#10B981' }]}>
              {remaining >= 0
                ? `Faltan ${formatCurrency(remaining)}`
                : `¡Superaste la meta por ${formatCurrency(Math.abs(remaining))}!`}
            </Text>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="wallet-outline" size={20} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Monto Objetivo</Text>
              <Text style={styles.detailValue}>{formatCurrency(goal.targetAmount)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="cash-outline" size={20} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Monto Actual</Text>
              <Text style={styles.detailValue}>{formatCurrency(goal.currentAmount)}</Text>
            </View>
          </View>

          {goal.deadline && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Fecha Límite</Text>
                <Text style={styles.detailValue}>{formatDate(goal.deadline)}</Text>
                {daysRemaining !== null && (
                  <Text style={[styles.detailExtra, daysRemaining < 30 && styles.detailExtraWarning]}>
                    {daysRemaining > 0
                      ? `${daysRemaining} días restantes`
                      : daysRemaining === 0
                      ? '¡Hoy es el día!'
                      : `Venció hace ${Math.abs(daysRemaining)} días`}
                  </Text>
                )}
              </View>
            </View>
          )}

          {goal.createdAt && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="add-circle-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Fecha de Creación</Text>
                <Text style={styles.detailValue}>{formatDate(goal.createdAt)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Statistics Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Estadísticas</Text>

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trending-up" size={24} color="#3B82F6" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Progreso</Text>
              <Text style={styles.statValue}>{Math.round(getPercentage())}%</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="flag-outline" size={24} color="#10B981" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Por alcanzar</Text>
              <Text style={[styles.statValue, { color: remaining >= 0 ? '#1F2937' : '#10B981' }]}>
                {formatCurrency(Math.max(remaining, 0))}
              </Text>
            </View>
          </View>

          {goal.deadline && daysRemaining !== null && (
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="time-outline" size={24} color="#F59E0B" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Ahorro diario sugerido</Text>
                <Text style={styles.statValue}>
                  {daysRemaining > 0
                    ? formatCurrency(Math.max(remaining, 0) / daysRemaining)
                    : formatCurrency(0)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Add Funds Button */}
        {!isCompleted && (
          <TouchableOpacity style={styles.addFundsButton} onPress={handleAddFunds}>
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.addFundsButtonText}>Agregar Fondos</Text>
          </TouchableOpacity>
        )}

        {/* Delete Button */}
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
              <Text style={styles.deleteButtonText}>Eliminar Objetivo</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Funds Modal */}
      <Modal
        visible={showAddFundsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddFundsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Fondos</Text>
              <TouchableOpacity onPress={() => setShowAddFundsModal(false)}>
                <Ionicons name="close" size={28} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              ¿Cuánto deseas agregar a tu objetivo?
            </Text>

            <View style={styles.modalAmountContainer}>
              <Text style={styles.modalCurrencySymbol}>$</Text>
              <TextInput
                style={styles.modalAmountInput}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                value={fundAmount}
                onChangeText={setFundAmount}
                keyboardType="numeric"
                autoFocus
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowAddFundsModal(false)}
                disabled={addingFunds}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalConfirmButton, addingFunds && styles.modalConfirmButtonDisabled]}
                onPress={confirmAddFunds}
                disabled={addingFunds}
              >
                {addingFunds ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalConfirmButtonText}>Agregar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainerCompleted: {
    backgroundColor: '#D1FAE5',
  },
  iconEmoji: {
    fontSize: 48,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  completedBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  amountDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  amountRight: {
    alignItems: 'flex-end',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressRemaining: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
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
  detailExtra: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  detailExtraWarning: {
    color: '#F59E0B',
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
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
  addFundsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addFundsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  modalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 12,
    paddingLeft: 20,
    marginBottom: 24,
  },
  modalCurrencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B7280',
    marginRight: 8,
  },
  modalAmountInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#10B981',
  },
  modalConfirmButtonDisabled: {
    opacity: 0.5,
  },
  modalConfirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});