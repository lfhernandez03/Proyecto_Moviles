// app/(tabs)/budget.tsx
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { useBudgetViewModel } from "@/src/viewmodels/tabs/budget/useBudgetViewModel";
import { Budget } from "@/src/models/Budget";
import { formatCurrency } from "@/src/utils/currency";

export default function BudgetView() {
  const {
    filteredBudgets,
    searchQuery,
    loading,
    summary,
    handleSearchChange,
    navigateToCreateBudget,
    navigateToBudgetDetail,
    calculatePercentage,
    getPercentageColor,
    isOverBudget,
    getOverBudgetAmount,
    refreshData,
  } = useBudgetViewModel();

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Presupuesto</Text>
          <Text style={styles.headerSubtitle}>
            Controla tus gastos mensuales
          </Text>
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
            <Text style={styles.summaryLabel}>Presupuesto Total</Text>
            <Text style={styles.summaryPercentage}>
              {Math.round(summary.percentage)}%
            </Text>
          </View>
          <View style={styles.summaryAmounts}>
            <Text style={styles.summarySpent}>
              {formatCurrency(summary.totalSpent, false)}
            </Text>
            <Text style={styles.summaryTotal}>
              / {formatCurrency(summary.totalBudget, false)}
            </Text>
          </View>
          <View style={styles.summaryProgressBar}>
            <View
              style={[
                styles.summaryProgress,
                {
                  width: `${Math.min(summary.percentage, 100)}%`,
                  backgroundColor: getPercentageColor(summary.percentage),
                },
              ]}
            />
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>
                {formatCurrency(Math.abs(summary.remainingBudget), false)}
              </Text>
              <Text style={styles.summaryStatLabel}>
                {summary.remainingBudget >= 0 ? 'Disponible' : 'Excedido'}
              </Text>
            </View>
            <View style={styles.summaryStatDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>
                {summary.categoriesOverBudget}
              </Text>
              <Text style={styles.summaryStatLabel}>Sobre presupuesto</Text>
            </View>
          </View>
        </View>

        {/* Crear nueva categoría */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={navigateToCreateBudget}
        >
          <Text style={styles.createButtonText}>Crear nueva categoría</Text>
          <View style={styles.createIcon}>
            <Ionicons name="add-circle" size={28} color="#10B981" />
          </View>
        </TouchableOpacity>

        {/* Categorías Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>

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
              placeholder="Buscar categoría"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearchChange("")}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Budget List */}
          {loading && filteredBudgets.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.loadingText}>Cargando presupuestos...</Text>
            </View>
          ) : filteredBudgets.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>
                {searchQuery
                  ? "No se encontraron resultados"
                  : "No hay presupuestos"}
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza creando tu primer presupuesto"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={navigateToCreateBudget}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text style={styles.emptyStateButtonText}>
                    Crear Presupuesto
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredBudgets.map((budget: Budget) => {
              const percentage = calculatePercentage(
                budget.spent,
                budget.amount
              );
              const color = getPercentageColor(percentage);
              const overBudget = isOverBudget(budget.spent, budget.amount);
              const overAmount = getOverBudgetAmount(
                budget.spent,
                budget.amount
              );

              return (
                <TouchableOpacity
                  key={budget.id}
                  style={styles.budgetItem}
                  onPress={() => navigateToBudgetDetail(budget.id)}
                >
                  <View style={styles.budgetHeader}>
                    <View style={styles.budgetTitleContainer}>
                      <View style={{ backgroundColor: budget.color }}></View>
                      <Text style={styles.budgetName}>
                        {budget.categoryName}
                      </Text>
                    </View>
                    <Text style={[styles.budgetPercentage, { color }]}>
                      {percentage}%
                    </Text>
                  </View>

                  <View style={styles.budgetAmounts}>
                    <Text style={styles.budgetSpent}>
                      {formatCurrency(budget.spent, false)}
                    </Text>
                    <Text style={styles.budgetTotal}>
                      / {formatCurrency(budget.amount, false)}
                    </Text>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: color,
                        },
                      ]}
                    />
                  </View>

                  {/* Over budget warning */}
                  {overBudget && (
                    <View style={styles.warningContainer}>
                      <Ionicons name="warning" size={16} color="#EF4444" />
                      <Text style={styles.warningText}>
                        Has excedido tu presupuesto en {formatCurrency(overAmount, false)}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  summaryPercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  summaryAmounts: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  summarySpent: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
  },
  summaryTotal: {
    fontSize: 18,
    color: "#9CA3AF",
    marginLeft: 4,
  },
  summaryProgressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  summaryProgress: {
    height: "100%",
    borderRadius: 4,
  },
  summaryStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryStatItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  summaryStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  createButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#10B981",
    borderStyle: "dashed",
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  createIcon: {
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#6B7280",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    gap: 8,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  budgetItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  budgetTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  budgetIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  budgetName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  budgetPercentage: {
    fontSize: 14,
    fontWeight: "600",
  },
  budgetAmounts: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  budgetSpent: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  budgetTotal: {
    fontSize: 16,
    color: "#9CA3AF",
    marginLeft: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  warningText: {
    fontSize: 12,
    color: "#EF4444",
    flex: 1,
  },
  bottomSpacing: {
    height: 20,
  },
});
