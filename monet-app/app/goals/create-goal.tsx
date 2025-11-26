import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '@/components/themed-view';
import { useCreateGoalViewModel } from '@/src/viewmodels/tabs/goals/useCreateGoalViewModel'

export default function CreateGoalScreen() {
  const {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
  } = useCreateGoalViewModel();

  // Local state for the date picker
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' && date) {
      setSelectedDate(date);
      const formattedDate = formatDate(date);
      handleInputChange('deadline', formattedDate);
    }

    if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const handleDatePickerToggle = () => {
    setShowDatePicker(true);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Objetivo</Text>
        <View style={styles.headerButton} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Título del objetivo <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="Ej: Comprar una casa"
              placeholderTextColor="#9CA3AF"
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              maxLength={50}
            />
            {errors.title && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{errors.title}</Text>
              </View>
            )}
            <Text style={styles.charCount}>
              {formData.title.length}/50 caracteres
            </Text>
          </View>

          {/* Description Input */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Descripción <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              placeholder="Describe tu objetivo y por qué es importante para ti"
              placeholderTextColor="#9CA3AF"
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
            {errors.description && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{errors.description}</Text>
              </View>
            )}
            <Text style={styles.charCount}>
              {formData.description.length}/200 caracteres
            </Text>
          </View>

          {/* Target Amount Input */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Monto objetivo <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.amountInput, errors.targetAmount && styles.inputError]}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                value={formData.targetAmount}
                onChangeText={(text) => handleInputChange('targetAmount', text)}
                keyboardType="numeric"
              />
            </View>
            {errors.targetAmount && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{errors.targetAmount}</Text>
              </View>
            )}
          </View>

          {/* Current Amount Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Monto inicial (opcional)</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                value={formData.currentAmount}
                onChangeText={(text) => handleInputChange('currentAmount', text)}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.helperText}>
              Si ya tienes algo ahorrado para este objetivo
            </Text>
          </View>

          {/* Deadline Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Fecha límite (opcional)</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={handleDatePickerToggle}
            >
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <Text style={[styles.datePickerText, formData.deadline && styles.datePickerTextSelected]}>
                {formData.deadline || 'Seleccionar fecha'}
              </Text>
              {formData.deadline && (
                <TouchableOpacity
                  onPress={() => handleInputChange('deadline', '')}
                  style={styles.clearDateButton}
                >
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            {errors.deadline && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{errors.deadline}</Text>
              </View>
            )}
            <Text style={styles.helperText}>
              Fecha para alcanzar tu objetivo
            </Text>
          </View>

          {/* Summary Card */}
          {formData.targetAmount && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumen</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Objetivo:</Text>
                <Text style={styles.summaryValue}>
                  ${parseFloat(formData.targetAmount || '0').toLocaleString('es-CO')}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Inicial:</Text>
                <Text style={styles.summaryValue}>
                  ${parseFloat(formData.currentAmount || '0').toLocaleString('es-CO')}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryRowHighlight]}>
                <Text style={styles.summaryLabelBold}>Por ahorrar:</Text>
                <Text style={styles.summaryValueBold}>
                  $
                  {(
                    parseFloat(formData.targetAmount || '0') -
                    parseFloat(formData.currentAmount || '0')
                  ).toLocaleString('es-CO')}
                </Text>
              </View>
              {formData.deadline && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Fecha límite:</Text>
                  <Text style={styles.summaryValue}>{formData.deadline}</Text>
                </View>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.createButton, loading && styles.createButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.createButtonText}>Crear Objetivo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
          locale="es-ES"
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingLeft: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  datePickerText: {
    flex: 1,
    fontSize: 16,
    color: '#9CA3AF',
  },
  datePickerTextSelected: {
    color: '#1F2937',
    fontWeight: '500',
  },
  clearDateButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'right',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryRowHighlight: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryLabelBold: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryValueBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 32,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    gap: 8,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacing: {
    height: 40,
  },
});