// components/ui/goal-card.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/src/utils/currency';

interface GoalCardProps {
  title: string;
  description?: string;
  currentAmount: number;
  targetAmount: number;
  deadline?: string;
  completedAt?: string;
  onPress: () => void;
}

export function GoalCard({
  title,
  description,
  currentAmount,
  targetAmount,
  deadline,
  completedAt,
  onPress,
}: GoalCardProps) {
  const progress = (currentAmount / targetAmount) * 100;
  const isCompleted = !!completedAt || currentAmount >= targetAmount;
  const remaining = targetAmount - currentAmount;

  const formatDeadline = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Vencido';
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays <= 30) return `${diffDays} días`;
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          <Text style={styles.completedText}>Completado</Text>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>
      {description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}

      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.current}>{formatCurrency(currentAmount, false)}</Text>
          <Text style={styles.target}>/ {formatCurrency(targetAmount, false)}</Text>
        </View>
        <Text style={styles.percentage}>{Math.round(progress)}%</Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            {
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: isCompleted ? '#10B981' : '#3B82F6',
            },
          ]}
        />
      </View>

      <View style={styles.footer}>
        {!isCompleted && remaining > 0 && (
          <View style={styles.remainingInfo}>
            <Text style={styles.remainingLabel}>Faltan</Text>
            <Text style={styles.remainingAmount}>
              {formatCurrency(remaining, false)}
            </Text>
          </View>
        )}
        {deadline && !isCompleted && (
          <View style={styles.deadlineInfo}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.deadlineText}>{formatDeadline(deadline)}</Text>
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
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
    gap: 4,
  },
  completedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  current: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  target: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  remainingLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  remainingAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  deadlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    fontSize: 11,
    color: '#6B7280',
  },
});
