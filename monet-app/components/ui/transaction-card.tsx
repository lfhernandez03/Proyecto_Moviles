// components/ui/transaction-card.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatSignedCurrency } from '@/src/utils/currency';

interface TransactionCardProps {
  id: string;
  type: 'income' | 'expense';
  category: string;
  categoryDisplayName?: string;
  description: string;
  amount: number;
  date: string;
  categoryColor?: string;
  onPress: () => void;
  formatRelativeDate?: (date: string) => string;
}

export function TransactionCard({
  type,
  category,
  categoryDisplayName,
  description,
  amount,
  date,
  categoryColor = '#10B981',
  onPress,
  formatRelativeDate,
}: TransactionCardProps) {
  const defaultFormatDate = (dateString: string): string => {
    const d = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
        <Ionicons
          name={type === 'income' ? 'arrow-down' : 'arrow-up'}
          size={20}
          color={categoryColor}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.category}>{categoryDisplayName || category}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.amount, type === 'income' ? styles.income : styles.expense]}>
          {formatSignedCurrency(amount, type)}
        </Text>
        <Text style={styles.date}>
          {formatRelativeDate ? formatRelativeDate(date) : defaultFormatDate(date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  income: {
    color: '#10B981',
  },
  expense: {
    color: '#EF4444',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
