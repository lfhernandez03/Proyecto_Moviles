// app/(tabs)/transactions.tsx
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
import { useTransactionsViewModel } from '@/src/viewmodels/tabs/transactions/useTransactionsViewModel';
import { Transaction } from '@/src/models/Transaction';
import { formatSignedCurrency } from '@/src/utils/currency';

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transacciones</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={navigateToAddTransaction}
        >
          <Ionicons name="add-circle" size={32} color="#10B981" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar transacciones"
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

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Todas' && styles.tabActive]}
          onPress={() => handleTabChange('Todas')}
        >
          <Text style={[styles.tabText, selectedTab === 'Todas' && styles.tabTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Ingresos' && styles.tabActive]}
          onPress={() => handleTabChange('Ingresos')}
        >
          <Text style={[styles.tabText, selectedTab === 'Ingresos' && styles.tabTextActive]}>
            Ingresos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Gastos' && styles.tabActive]}
          onPress={() => handleTabChange('Gastos')}
        >
          <Text style={[styles.tabText, selectedTab === 'Gastos' && styles.tabTextActive]}>
            Gastos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <ScrollView 
        style={styles.transactionsList} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      >
        {loading && filteredTransactions.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Cargando transacciones...</Text>
          </View>
        ) : filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No se encontraron resultados' : 'No hay transacciones'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza agregando tu primera transacción'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={navigateToAddTransaction}
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.emptyStateButtonText}>
                  Agregar Transacción
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredTransactions.map((transaction: Transaction) => (
            <TouchableOpacity 
              key={transaction.id} 
              style={styles.transactionItem}
              onPress={() => navigateToTransactionDetail(transaction.id)}
            >
              <View style={[
                styles.transactionIcon, 
                { backgroundColor: getCategoryColor(transaction.category) }
              ]}>
                <Text style={styles.transactionEmoji}>
                  {transaction.icon || '📝'}
                </Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionCategory}>
                  {transaction.category}
                </Text>
                <Text style={styles.transactionDate}>
                  {formatRelativeDate(transaction.date)}
                </Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                transaction.type === 'income' 
                  ? styles.amountPositive 
                  : styles.amountNegative
              ]}>
                {formatSignedCurrency(transaction.amount, transaction.type)}
              </Text>
            </TouchableOpacity>
          ))
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
  addButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
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
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountPositive: {
    color: '#10B981',
  },
  amountNegative: {
    color: '#EF4444',
  },
  bottomSpacing: {
    height: 20,
  },
});