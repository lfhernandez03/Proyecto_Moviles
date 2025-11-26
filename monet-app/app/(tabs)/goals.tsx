import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { useGoalsViewModel } from '@/src/viewmodels/tabs/goals/useGoalsViewModel';
import { formatCurrency } from '@/src/utils/currency';

export default function FinancialGoalsView() {
  const {
    goals,
    searchQuery,
    loading,
    summary,
    handleSearchChange,
    navigateToCreateGoal,
    navigateToGoalDetail,
    calculateProgress,
    refreshData,
  } = useGoalsViewModel();

  const filteredGoals = goals.filter((goal) =>
    goal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header Sticky */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Objetivos Financieros</Text>
          <Text style={styles.headerSubtitle}>Alcanza tus metas</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      >
        {/* Resumen Total */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryLabel}>Progreso Total</Text>
            <Text style={styles.summaryPercentage}>
              {Math.round(summary.overallProgress)}%
            </Text>
          </View>
          <View style={styles.summaryAmounts}>
            <Text style={styles.summarySaved}>
              ${summary.totalSaved.toLocaleString()}
            </Text>
            <Text style={styles.summaryTotal}>
              / ${summary.totalTarget.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryProgressBar}>
            <View
              style={[
                styles.summaryProgress,
                {
                  width: `${Math.min(summary.overallProgress, 100)}%`,
                  backgroundColor: '#3B82F6',
                },
              ]}
            />
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>
                ${Math.abs(summary.remaining).toLocaleString()}
              </Text>
              <Text style={styles.summaryStatLabel}>
                Por ahorrar
              </Text>
            </View>
            <View style={styles.summaryStatDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>
                {summary.completedGoals}
              </Text>
              <Text style={styles.summaryStatLabel}>Completados</Text>
            </View>
            <View style={styles.summaryStatDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>
                {summary.activeGoals}
              </Text>
              <Text style={styles.summaryStatLabel}>Activos</Text>
            </View>
          </View>
        </View>

        {/* Create New Goal Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={navigateToCreateGoal}
        >
          <Text style={styles.createButtonText}>Crear nuevo objetivo</Text>
          <View style={styles.createIcon}>
            <Ionicons name="add-circle" size={28} color="#10B981" />
          </View>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar objetivos"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Goals List */}
        {loading && goals.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Cargando objetivos...</Text>
          </View>
        ) : filteredGoals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="flag-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No se encontraron resultados' : 'No hay objetivos'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primer objetivo financiero'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={navigateToCreateGoal}
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.emptyStateButtonText}>
                  Crear Objetivo
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.goalsList}>
            {filteredGoals.map((goal) => {
              const progress = calculateProgress(goal);
              const isCompleted = goal.currentAmount >= goal.targetAmount;

              return (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.goalCard}
                  onPress={() => navigateToGoalDetail(goal.id!)}
                >
                  {/* Goal Header */}
                  <View style={styles.goalHeader}>
                    <View
                      style={[
                        styles.goalIcon,
                        isCompleted && styles.goalIconCompleted,
                      ]}
                    >
                      <Text style={styles.goalEmoji}>{goal.icon || '🎯'}</Text>
                    </View>
                    <View style={styles.goalTitleContainer}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      {goal.deadline && (
                        <Text style={styles.goalDeadline}>
                          Meta: {new Date(goal.deadline).toLocaleDateString('es-ES')}
                        </Text>
                      )}
                    </View>
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                      </View>
                    )}
                  </View>

                  {/* Amount */}
                  <View style={styles.amountContainer}>
                    <Text style={styles.amountCurrent}>
                      {formatCurrency(goal.currentAmount)}
                    </Text>
                    <Text style={styles.amountTarget}>
                      / {formatCurrency(goal.targetAmount)}
                    </Text>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: isCompleted ? '#10B981' : '#3B82F6',
                        },
                      ]}
                    />
                  </View>

                  {/* Progress Info */}
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressPercentage}>
                      {Math.round(progress)}% completado
                    </Text>
                    <Text style={styles.progressRemaining}>
                      Faltan {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount))}
                    </Text>
                  </View>

                  {/* Add Funds Button */}
                  {!isCompleted && (
                    <TouchableOpacity
                      style={styles.addFundsButton}
                      onPress={() => navigateToGoalDetail(goal.id!)}
                    >
                      <Ionicons name="add-outline" size={20} color="#fff" />
                      <Text style={styles.addFundsButtonText}>
                        Agregar Fondos
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
  scrollView: {
    flex: 1,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  summaryPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  summaryAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  summarySaved: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summaryTotal: {
    fontSize: 20,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  summaryProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  summaryProgress: {
    height: '100%',
    borderRadius: 4,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  summaryStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  createButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10B981',
  },
  createIcon: {
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    gap: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  goalsList: {
    paddingHorizontal: 20,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalIconCompleted: {
    backgroundColor: '#D1FAE5',
  },
  goalEmoji: {
    fontSize: 24,
  },
  goalTitleContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  goalDeadline: {
    fontSize: 12,
    color: '#6B7280',
  },
  completedBadge: {
    marginLeft: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  amountCurrent: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  amountTarget: {
    fontSize: 16,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressRemaining: {
    fontSize: 14,
    color: '#6B7280',
  },
  addFundsButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addFundsButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});