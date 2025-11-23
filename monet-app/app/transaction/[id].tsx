// app/transaction/[id].tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { TransactionService } from '@/src/services/firestore/TransactionService';
import { Transaction } from '@/src/models/Transaction';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    if (!id) return;

    try {
      setLoading(true);
      // Aquí cargarías la transacción específica
      // const data = await TransactionService.getTransactionById(id);
      // setTransaction(data);
    } catch (error) {
      console.error('Error al cargar transacción:', error);
      Alert.alert('Error', 'No se pudo cargar la transacción');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#10B981" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Transacción</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>ID: {id}</Text>
        <Text style={styles.info}>
          Aquí irá el detalle de la transacción
        </Text>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});