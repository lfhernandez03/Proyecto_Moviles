import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { PageHeader, SearchBar, SummaryCard, GoalCard, EmptyState } from '@/components/ui';
import { useGoalsViewModel } from '@/src/viewmodels/tabs/goals/useGoalsViewModel';

export default function FinancialGoalsView() {
  const {
    goals,
    searchQuery,
    loading,
    summary,
    handleSearchChange,
    navigateToCreateGoal,
    navigateToGoalDetail,
    refreshData,
  } = useGoalsViewModel();

  const filteredGoals = goals.filter((goal) =>
    goal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <PageHeader
        title="Objetivos Financieros"
        subtitle="Alcanza tus metas"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      >
        {/* Resumen Total */}
        <SummaryCard
          title="Progreso Total"
          percentage={Math.round(summary.overallProgress)}
          currentAmount={summary.totalSaved}
          totalAmount={summary.totalTarget}
          progressColor="#3B82F6"
          stats={[
            {
              label: 'Por ahorrar',
              value: `$${Math.abs(summary.remaining).toLocaleString()}`,
            },
            {
              label: 'Completados',
              value: summary.completedGoals.toString(),
            },
            {
              label: 'Activos',
              value: summary.activeGoals.toString(),
            },
          ]}
        />

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
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Buscar objetivos"
        />

        {/* Goals List */}
        {loading && goals.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Cargando objetivos...</Text>
          </View>
        ) : filteredGoals.length === 0 ? (
          <EmptyState
            icon="flag-outline"
            title={searchQuery ? 'No se encontraron resultados' : 'No hay objetivos'}
            description={
              searchQuery
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primer objetivo financiero'
            }
            actionLabel={!searchQuery ? 'Crear Objetivo' : undefined}
            onAction={!searchQuery ? navigateToCreateGoal : undefined}
          />
        ) : (
          <View style={styles.goalsList}>
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                title={goal.title}
                description={goal.description}
                currentAmount={goal.currentAmount}
                targetAmount={goal.targetAmount}
                deadline={goal.deadline}
                completedAt={goal.completedAt}
                onPress={() => navigateToGoalDetail(goal.id!)}
              />
            ))}
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
    marginTop: 20,
    marginBottom: 24,
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
    paddingVertical: 16,
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