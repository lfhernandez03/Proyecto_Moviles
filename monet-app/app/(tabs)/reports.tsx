// app/(tabs)/reports.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { useReportsViewModel } from "@/src/viewmodels/tabs/reports/useReportsViewModel";
import { formatCurrency } from "@/src/utils/currency";

export default function ReportsScreen() {
  const {
    selectedPeriod,
    reportData,
    loading,
    handlePeriodChange,
    getPeriodLabel,
    getAverageText,
    refreshData,
  } = useReportsViewModel();

  // Calcular el valor máximo para el gráfico
  const maxValue = reportData?.chartData
    ? Math.max(
        ...reportData.chartData.map((d) => Math.max(d.income, d.expense)),
        1
      )
    : 1;

  return (
    <ThemedView style={styles.container}>
      {/* Header Sticky */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Reportes</Text>
          <Text style={styles.headerSubtitle}>Análisis de tus finanzas</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "week" && styles.periodButtonActive,
            ]}
            onPress={() => handlePeriodChange("week")}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === "week" && styles.periodTextActive,
              ]}
            >
              Semana
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "month" && styles.periodButtonActive,
            ]}
            onPress={() => handlePeriodChange("month")}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === "month" && styles.periodTextActive,
              ]}
            >
              Mes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "year" && styles.periodButtonActive,
            ]}
            onPress={() => handlePeriodChange("year")}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === "year" && styles.periodTextActive,
              ]}
            >
              Año
            </Text>
          </TouchableOpacity>
        </View>

        {loading && !reportData ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Cargando reporte...</Text>
          </View>
        ) : !reportData ? (
          <View style={styles.emptyState}>
            <Ionicons name="bar-chart-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No hay datos</Text>
            <Text style={styles.emptyStateSubtitle}>
              Agrega transacciones para ver tu reporte
            </Text>
          </View>
        ) : (
          <>
            {/* Financial Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumen Financiero</Text>
              <View style={styles.summaryCards}>
                <View style={styles.summaryCard}>
                  <View
                    style={[styles.summaryIcon, { backgroundColor: "#D1FAE5" }]}
                  >
                    <Ionicons name="trending-up" size={24} color="#10B981" />
                  </View>
                  <Text style={styles.summaryLabel}>Flujo de Caja</Text>
                  <Text
                    style={[
                      styles.summaryAmount,
                      {
                        color:
                          reportData.summary.netCashFlow >= 0
                            ? "#10B981"
                            : "#EF4444",
                      },
                    ]}
                  >
                    {reportData.summary.netCashFlow >= 0 ? "+" : ""}
                    {formatCurrency(reportData.summary.netCashFlow)}
                  </Text>
                </View>
                <View style={styles.summaryCard}>
                  <View
                    style={[styles.summaryIcon, { backgroundColor: "#DBEAFE" }]}
                  >
                    <Ionicons name="wallet-outline" size={24} color="#3B82F6" />
                  </View>
                  <Text style={styles.summaryLabel}>Tasa de Ahorro</Text>
                  <Text style={[styles.summaryAmount, { color: "#3B82F6" }]}>
                    {reportData.summary.savingsRate}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Income vs Expenses Chart */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingresos vs Gastos</Text>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: "#10B981" }]}
                  />
                  <Text style={styles.legendText}>Ingresos</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: "#EF4444" }]}
                  />
                  <Text style={styles.legendText}>Gastos</Text>
                </View>
              </View>

              <View style={styles.chartContainer}>
                {reportData.chartData.map((data, index) => (
                  <View key={index} style={styles.chartColumn}>
                    <View style={styles.barsContainer}>
                      <View
                        style={[
                          styles.bar,
                          styles.barIncome,
                          {
                            height: `${(data.income / maxValue) * 100}%`,
                            minHeight: data.income > 0 ? 4 : 0,
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.bar,
                          styles.barExpense,
                          {
                            height: `${(data.expense / maxValue) * 100}%`,
                            minHeight: data.expense > 0 ? 4 : 0,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.chartLabel}>{data.label}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.chartFooter}>
                <Text style={styles.chartFooterText}>{getAverageText()}</Text>
              </View>
            </View>

            {/* Expenses by Category */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gastos por categoría</Text>
              <View style={styles.totalCard}>
                <Text style={styles.totalAmount}>
                  {formatCurrency(reportData.summary.totalExpense)}
                </Text>
                <Text style={styles.totalLabel}>
                  Total gastado {getPeriodLabel(selectedPeriod).toLowerCase()}
                </Text>
              </View>

              {reportData.categoryExpenses.length === 0 ? (
                <View style={styles.emptyCategories}>
                  <Ionicons
                    name="pie-chart-outline"
                    size={48}
                    color="#9CA3AF"
                  />
                  <Text style={styles.emptyCategoriesText}>
                    No hay gastos registrados
                  </Text>
                </View>
              ) : (
                <View style={styles.categoriesList}>
                  {reportData.categoryExpenses.map((category, index) => (
                    <View key={index} style={styles.categoryItem}>
                      <View style={styles.categoryLeft}>
                        <View
                          style={[
                            styles.categoryIconContainer,
                            { backgroundColor: category.color },
                          ]}
                        ></View>
                        <View style={styles.categoryInfo}>
                          <Text style={styles.categoryName}>
                            {category.categoryName}
                          </Text>
                          <Text style={styles.categoryPercentage}>
                            {category.percentage}% del total
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.categoryAmount}>
                        {formatCurrency(category.amount)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        )}

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
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  periodSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
    backgroundColor: "#fff",
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  periodButtonActive: {
    backgroundColor: "#10B981",
  },
  periodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  periodTextActive: {
    color: "#fff",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 64,
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
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  summaryCards: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10B981",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: "#6B7280",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
  },
  chartColumn: {
    alignItems: "center",
    flex: 1,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 150,
    gap: 4,
  },
  bar: {
    width: 20,
    borderRadius: 4,
  },
  barIncome: {
    backgroundColor: "#10B981",
  },
  barExpense: {
    backgroundColor: "#EF4444",
  },
  chartLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
  },
  chartFooter: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
  },
  chartFooterText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  totalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyCategories: {
    alignItems: "center",
    paddingVertical: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  emptyCategoriesText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  categoriesList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: "#6B7280",
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 20,
  },
});
