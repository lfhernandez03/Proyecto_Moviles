import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useRecoveryViewModel } from "@/src/viewmodels/auth/useRecoveryViewModel";
import { router } from "expo-router";


export default function MonetRecovery() {
  const {
    email,
    loading,
    setEmail,
    handlePasswordReset,
  } = useRecoveryViewModel();

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header con botón de regreso */}
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#10B981" />
              </TouchableOpacity>
              <ThemedText style={styles.headerText}>Registro</ThemedText>
            </View>

            {/* Card Principal */}
            <View style={styles.card}>
              {/* Logo y Título */}
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="trending-up" size={32} color="#fff" />
                </View>
                <Text style={styles.title}>MONET</Text>
                <Text style={styles.subtitle}>
                  Controla tus finanzas con inteligencia :)
                </Text>
              </View>

              {/* Título de Registro */}
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>Recupera tu contraseña</Text>
                <Text style={styles.welcomeSubtitle}>
                  Ingresa tu correo y te enviaremos un enlace para restablecerla. 
                  Revisa también tu carpeta de spam si no recibes el mensaje.
                </Text>
              </View>

              {/* Formulario */}
                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Correo electrónico</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="tu@email.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>

              {/* Link a Login */}
              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginQuestion}>¿Recordaste tu contraseña?</Text>
                <TouchableOpacity onPress={() => router.push("/(auth)")}>
                  <Text style={styles.link}>Inicia sesión aquí</Text>
                </TouchableOpacity>
              </View>

              {/* Botón Registrarse */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handlePasswordReset}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Enviando..." : "Enviar"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    marginRight: 12,
  },
  headerText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  welcomeContainer: {
    marginBottom: 24,
  },
  welcomeTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#6B7280",
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  loginLinkContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  loginQuestion: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  link: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#10B981",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#6EE7B7",
    opacity: 0.7,
  },
});
