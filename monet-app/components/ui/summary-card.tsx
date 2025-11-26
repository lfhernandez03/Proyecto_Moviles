// components/ui/summary-card.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { formatCurrency } from '@/src/utils/currency';

interface SummaryCardProps {
  title: string;
  percentage: number;
  currentAmount: number;
  totalAmount: number;
  progressColor?: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
  style?: ViewStyle;
}

export function SummaryCard({
  title,
  percentage,
  currentAmount,
  totalAmount,
  progressColor = '#10B981',
  stats,
  style,
}: SummaryCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      </View>

      <View style={styles.amounts}>
        <Text style={styles.current}>{formatCurrency(currentAmount, false)}</Text>
        <Text style={styles.total}>/ {formatCurrency(totalAmount, false)}</Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: progressColor,
            },
          ]}
        />
      </View>

      {stats && stats.length > 0 && (
        <View style={styles.stats}>
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              {index > 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {typeof stat.value === 'number'
                    ? stat.value.toLocaleString()
                    : stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  amounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  current: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  total: {
    fontSize: 16,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
});
