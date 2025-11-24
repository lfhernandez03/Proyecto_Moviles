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
import { useCreateBudgetViewModel } from "@/src/viewmodels/tabs/budget/useCreateBudgetViewModel";

export default function CreateBudgetScreen() {
  const {
    amount,
    description,
    setDescription,
    selectedCategory,
    categories,
    loading,
    loadingCategories,
    handleAmountChange,
    handleCategorySelect,
    handleSave,
    handleClose,
    navigateToCreateCategory,
  } = useCreateBudgetViewModel();

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
            style={styles.closeButton}
            disabled={loading}
          >
            <Ionicons name="close" size={28} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear Presupuesto</Text>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar</Text>
            )}
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Content */}
          <View style={styles.content}>
            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color="#3B82F6" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>¿Qué es un presupuesto?</Text>
                <Text style={styles.infoText}>
                  Establece límites de gasto por categoría para controlar tus
                  finanzas mensuales.
                </Text>
              </View>
            </View>

            {/* Categoría */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Categoría <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.sectionSubtitle}>
                Selecciona la categoría para este presupuesto
              </Text>

              {loadingCategories ? (
                <View style={styles.loadingCategories}>
                  <ActivityIndicator size="small" color="#10B981" />
                  <Text style={styles.loadingText}>Cargando categorías...</Text>
                </View>
              ) : (
                <>
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
                        {category.isCustom && (
                          <View style={styles.customBadge}>
                            <Ionicons name="star" size={10} color="#fff" />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}

                    {/* Botón para agregar nueva categoría */}
                    <TouchableOpacity
                      style={styles.addCategoryButton}
                      onPress={navigateToCreateCategory}
                      disabled={loading}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color="#10B981"
                      />
                      <Text style={styles.addCategoryText}>Nueva</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>

            {/* Monto */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Monto Mensual <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.sectionSubtitle}>
                ¿Cuánto planeas gastar este mes?
              </Text>
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
              <Text style={styles.sectionTitle}>
                Descripción <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.sectionSubtitle}>
                Agrega una nota sobre este presupuesto
              </Text>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Ej: Presupuesto mensual para comidas y restaurantes"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>

            {/* Preview Card */}
            {selectedCategory && amount && (
              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>Vista Previa</Text>
                <View style={styles.previewContent}>
                  <View style={styles.previewHeader}>
                    <View style={styles.previewTitleContainer}>
                      <View
                        style={[
                          styles.previewIconContainer,
                          {
                            backgroundColor: categories.find(
                              (c) => c.name === selectedCategory
                            )?.color,
                          },
                        ]}
                      ></View>
                      <Text style={styles.previewCategoryName}>
                        {
                          categories.find((c) => c.name === selectedCategory)
                            ?.displayName
                        }
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.previewAmount}>
                    ${parseFloat(amount || '0').toLocaleString('es-MX')}
                  </Text>
                  <View style={styles.previewProgressBar}>
                    <View style={styles.previewProgress} />
                  </View>
                  <Text style={styles.previewDescription}>
                    {description || "Sin descripción"}
                  </Text>
                </View>
              </View>
            )}
          </View>
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
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  saveButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#DBEAFE",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 18,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  required: {
    color: "#EF4444",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  loadingCategories: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  categoryButtonSelected: {
    borderColor: "#1F2937",
    borderWidth: 3,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  customBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#F59E0B",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#10B981",
    borderStyle: "dashed",
    backgroundColor: "#F0FDF4",
  },
  addCategoryText: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "600",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  amountSymbol: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1F2937",
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1F2937",
    minWidth: 100,
    textAlign: "left",
  },
  currencyLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 8,
  },
  descriptionInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
    minHeight: 120,
  },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#10B981",
    borderStyle: "dashed",
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 12,
  },
  previewContent: {
    padding: 12,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  previewTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  previewIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  previewIcon: {
    fontSize: 20,
  },
  previewCategoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  previewAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  previewProgressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  previewProgress: {
    height: "100%",
    width: "0%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  previewDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
});
