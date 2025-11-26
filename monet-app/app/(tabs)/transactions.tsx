// app/(tabs)/transactions.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import {
  PageHeader,
  SearchBar,
  TransactionCard,
  EmptyState,
} from "@/components/ui";
import { useTransactionsViewModel } from "@/src/viewmodels/tabs/transactions/useTransactionsViewModel";
import { Transaction } from "@/src/models/Transaction";

export default function TransactionsView() {
  const {
    filteredTransactions,
    selectedTab,
    searchQuery,
    loading,
    handleTabChange,
    handleSearchChange,
    navigateToAddTransaction,
    navigateToTransactionDetail,
    getCategoryColor,
    formatRelativeDate,
    refreshData,
  } = useTransactionsViewModel();

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <PageHeader title="Transacciones" subtitle="Maneja tus movimientos" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      >
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Buscar transacciones"
        />

        {/* Crear nueva transacción */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={navigateToAddTransaction}
        >
          <Text style={styles.createButtonText}>Crear nueva transacción</Text>
          <View style={styles.createIcon}>
            <Ionicons name="add-circle" size={28} color="#10B981" />
          </View>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "Todas" && styles.tabActive]}
            onPress={() => handleTabChange("Todas")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "Todas" && styles.tabTextActive,
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "Ingresos" && styles.tabActive]}
            onPress={() => handleTabChange("Ingresos")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "Ingresos" && styles.tabTextActive,
              ]}
            >
              Ingresos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "Gastos" && styles.tabActive]}
            onPress={() => handleTabChange("Gastos")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "Gastos" && styles.tabTextActive,
              ]}
            >
              Gastos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          {loading && filteredTransactions.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.loadingText}>Cargando transacciones...</Text>
            </View>
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              icon="receipt-outline"
              title={
                searchQuery
                  ? "No se encontraron resultados"
                  : "No hay transacciones"
              }
              description={
                searchQuery
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza agregando tu primera transacción"
              }
              actionLabel={!searchQuery ? "Agregar Transacción" : undefined}
              onAction={!searchQuery ? navigateToAddTransaction : undefined}
            />
          ) : (
            filteredTransactions.map((transaction: Transaction) => (
              <TransactionCard
                key={transaction.id}
                id={transaction.id}
                type={transaction.type}
                category={transaction.category}
                description={transaction.description}
                amount={transaction.amount}
                date={transaction.date}
                categoryColor={getCategoryColor(transaction.category)}
                onPress={() => navigateToTransactionDetail(transaction.id)}
                formatRelativeDate={formatRelativeDate}
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
  },
  addButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
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
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tabActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#fff",
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
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
  transactionCategory: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
    textTransform: "capitalize",
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
  bottomSpacing: {
    height: 20,
  },
});
