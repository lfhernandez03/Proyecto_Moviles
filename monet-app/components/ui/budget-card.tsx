// components/ui/budget-card.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/src/utils/currency';

interface BudgetCardProps {
  categoryName: string;
  spent: number;
  amount: number;
  color: string;
  period: 'weekly' | 'monthly' | 'yearly';
  onPress: () => void;
}

export function BudgetCard({
  categoryName,
  spent,
  amount,
  color,
  period,
  onPress,
}: BudgetCardProps) {
  const percentage = (spent / amount) * 100;
  const isOverBudget = spent > amount;
  const overBudgetAmount = spent - amount;

  const getPercentageColor = (percent: number): string => {
    if (percent >= 100) return '#EF4444';
    if (percent >= 80) return '#F59E0B';
    if (percent >= 60) return '#3B82F6';
    return '#10B981';
  };

  const getPeriodText = (p: string): string => {
    const translations: Record<string, string> = {
      weekly: 'Semanal',
      monthly: 'Mensual',
      yearly: 'Anual',
    };
    return translations[p] || p;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <View style={[styles.colorIndicator, { backgroundColor: color }]} />
          <View>
            <Text style={styles.categoryName}>{categoryName}</Text>
            <Text style={styles.period}>{getPeriodText(period)}</Text>
          </View>
        </View>
        <View style={styles.amountInfo}>
          <Text style={styles.spent}>{formatCurrency(spent, false)}</Text>
          <Text style={styles.budget}>/ {formatCurrency(amount, false)}</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: getPercentageColor(percentage),
            },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.percentage, { color: getPercentageColor(percentage) }]}>
          {Math.round(percentage)}% usado
        </Text>
        {isOverBudget && (
          <View style={styles.warningBadge}>
            <Ionicons name="warning" size={14} color="#EF4444" />
            <Text style={styles.warningText}>
              +{formatCurrency(overBudgetAmount, false)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  period: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  spent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  budget: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progress: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
});
