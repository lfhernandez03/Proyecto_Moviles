// components/ui/page-header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: {
    icon?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
  style?: ViewStyle;
}

export function PageHeader({ title, subtitle, rightAction, style }: PageHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {rightAction && (
        <TouchableOpacity style={styles.actionButton} onPress={rightAction.onPress}>
          {rightAction.icon && (
            <Ionicons name={rightAction.icon} size={24} color="#6B7280" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerContent: {
    flex: 1,
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
  actionButton: {
    padding: 8,
  },
});
