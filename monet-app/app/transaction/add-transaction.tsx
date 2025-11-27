// app/transaction/add-transaction.tsx
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { useAddTransactionViewModel } from "@/src/viewmodels/tabs/transactions/useAddTransactionViewModel";

export default function AddTransactionScreen() {
  const {
    type,
    amount,
    description,
    setDescription,
    selectedCategory,
    categories,
    loading,
    handleTypeChange,
    handleAmountChange,
    handleCategorySelect,
    handleSave,
    handleClose,
  } = useAddTransactionViewModel();

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.headerButton}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nueva Transacción</Text>
          <View style={styles.headerButton} />
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Content */}
          <View style={styles.content}>
            {/* Tipo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo</Text>
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === "expense" && styles.typeButtonActiveExpense,
                  ]}
                  onPress={() => handleTypeChange("expense")}
                  disabled={loading}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color={type === "expense" ? "#fff" : "#6B7280"}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === "expense" && styles.typeButtonTextActive,
                    ]}
                  >
                    Gasto
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === "income" && styles.typeButtonActiveIncome,
                  ]}
                  onPress={() => handleTypeChange("income")}
                  disabled={loading}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color={type === "income" ? "#fff" : "#6B7280"}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === "income" && styles.typeButtonTextActive,
                    ]}
                  >
                    Ingreso
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Monto */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Monto</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.amountSymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={handleAmountChange}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  editable={!loading}
                />
                <Text style={styles.currencyLabel}>COP</Text>
              </View>
            </View>

            {/* Descripción */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder={
                  type === "income"
                    ? "¿De dónde proviene el ingreso?"
                    : "¿En qué gastaste?"
                }
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>

            {/* Categoría - Solo mostrar si es gasto */}
            {type === "expense" && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categoría</Text>
                <View style={styles.categoriesContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.name}
                      style={[
                        styles.categoryButton,
                        { backgroundColor: category.color },
                        selectedCategory === category.name &&
                          styles.categoryButtonSelected,
                      ]}
                      onPress={() => handleCategorySelect(category.name)}
                      disabled={loading}
                    >
                      <Text style={styles.categoryButtonText}>
                        {category.displayName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Info adicional para ingresos */}
            {type === "income" && (
              <View style={styles.infoBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#10B981"
                />
                <Text style={styles.infoText}>
                  Los ingresos no requieren categoría. Se registrarán
                  automáticamente.
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.createButton, loading && styles.createButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.createButtonText}>Guardar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  headerButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  typeButtonActiveExpense: {
    backgroundColor: "#EF4444",
  },
  typeButtonActiveIncome: {
    backgroundColor: "#10B981",
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  amountSymbol: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1F2937",
    marginRight: 8,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1F2937",
    minWidth: 100,
    textAlign: "left",
  },
  currencyLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 8,
  },
  descriptionInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1F2937",
    minHeight: 100,
    textAlignVertical: "top",
  },
  categoriesContainer: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryButtonSelected: {
    borderColor: "#1F2937",
    borderWidth: 2,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#D1FAE5",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#047857",
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 32,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  createButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    gap: 8,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  bottomSpacing: {
    height: 40,
  },
});
