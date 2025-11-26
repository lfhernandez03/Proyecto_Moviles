import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { PageHeader, TransactionCard, EmptyState } from "@/components/ui";
import { useHomeViewModel } from "@/src/viewmodels/tabs/useHomeViewModel";
import { Transaction } from "@/src/models/Transaction";

export default function HomeView() {
  const {
    transactions,
    summary,
    loading,
    balanceVisible,
    currentUser,
    toggleBalanceVisibility,
    navigateToAddIncome,
    navigateToAddExpense,
    navigateToBudget,
    navigateToReports,
    navigateToTransactionDetail,
    formatAmount,
    refreshData,
  } = useHomeViewModel();

  // Función para formatear fecha relativa
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Función para formatear el nombre de la categoría
  const formatCategoryName = (category: string): string => {
    const translations: { [key: string]: string } = {
      food: "Alimentación",
      transport: "Transporte",
      shopping: "Compras",
      entertainment: "Entretenimiento",
      bills: "Servicios",
      salary: "Salario",
      health: "Salud",
      other: "Otro",
    };
    return translations[category] || category;
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <PageHeader
        title={`¡Hola, ${currentUser?.displayName?.split(" ")[0] || "Usuario"}!`}
        subtitle="Gestiona tus finanzas"
        rightAction={{
          icon: balanceVisible ? "eye-outline" : "eye-off-outline",
          onPress: toggleBalanceVisibility,
        }}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance total</Text>
          <Text style={styles.balanceAmount}>
            {formatAmount(summary.balance)}
          </Text>
          <View style={styles.balanceDetails}>
            <View style={styles.balanceItem}>
              <Ionicons name="trending-up" size={16} color="#fff" />
              <Text style={styles.balanceText}>
                Ingresos: {formatAmount(summary.totalIncome)}
              </Text>
            </View>
            <View style={styles.balanceItem}>
              <Ionicons name="trending-down" size={16} color="#fff" />
              <Text style={styles.balanceText}>
                Gastos: {formatAmount(summary.totalExpenses)}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.summaryCardGreen]}>
            <Ionicons name="calendar-outline" size={24} color="#fff" />
            <Text style={styles.summaryLabel}>Ahorro del Mes</Text>
            <Text style={styles.summaryAmount}>
              {formatAmount(summary.monthSavings)}
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardRed]}>
            <Ionicons name="cash-outline" size={24} color="#fff" />
            <Text style={styles.summaryLabel}>Gastos del Mes</Text>
            <Text style={styles.summaryAmount}>
              {formatAmount(summary.monthExpenses)}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToAddIncome}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="add" size={28} color="#10B981" />
              </View>
              <Text style={styles.actionText}>Agregar Ingreso</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToAddExpense}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="remove" size={28} color="#EF4444" />
              </View>
              <Text style={styles.actionText}>Registrar Gasto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToBudget}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="wallet-outline" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionText}>Presupuesto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToReports}
            >
              <View style={styles.actionIcon}>
                <Ionicons
                  name="stats-chart-outline"
                  size={24}
                  color="#F59E0B"
                />
              </View>
              <Text style={styles.actionText}>Estadísticas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transacciones Recientes</Text>
          {transactions.length === 0 ? (
            <EmptyState
              icon="receipt-outline"
              title="No hay transacciones aún"
              description="Comienza agregando tu primer ingreso o gasto"
              actionLabel="Agregar transacción"
              onAction={navigateToAddExpense}
            />
          ) : (
            transactions.map((transaction: Transaction) => (
              <TransactionCard
                key={transaction.id}
                id={transaction.id}
                type={transaction.type}
                category={formatCategoryName(transaction.category)}
                description={transaction.description}
                amount={transaction.amount}
                date={transaction.date}
                categoryColor={transaction.type === 'income' ? '#10B981' : '#EF4444'}
                onPress={() => navigateToTransactionDetail(transaction.id)}
                formatRelativeDate={formatDate}
              />
            ))
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
  eyeButton: {
    padding: 8,
  },
  balanceCard: {
    backgroundColor: "#10B981",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: "row",
    gap: 24,
  },
  balanceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  balanceText: {
    color: "#fff",
    fontSize: 12,
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
  },
  summaryCardGreen: {
    backgroundColor: "#10B981",
  },
  summaryCardRed: {
    backgroundColor: "#EF4444",
  },
  summaryLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  summaryAmount: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#1F2937",
    textAlign: "center",
    fontWeight: "500",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionEmoji: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  transactionSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  amountPositive: {
    color: "#10B981",
  },
  amountNegative: {
    color: "#EF4444",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
  bottomSpacing: {
    height: 20,
  },
});
