import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import { useLoginViewModel } from '@/src/viewmodels/auth/UseLoginViewModel';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

export default function LoginView() {
   const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    signIn,
  } = useLoginViewModel();

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
            {/* Header */}
            <ThemedText style={styles.headerText}>Login</ThemedText>

            {/* Card Principal */}
            <View style={styles.card}>
              {/* Logo y Título */}
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="trending-up" size={32} color="#fff" />
                </View>
                <ThemedText type="title" style={styles.title}>
                  MONET
                </ThemedText>
                <Text style={styles.subtitle}>
                  Controla tus finanzas con inteligencia :)
                </Text>
              </View>

              {/* Bienvenida */}
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Inicia sesión para continuar gestionando tus finanzas
                </Text>
              </View>

              {/* Formulario */}
              <View style={styles.formContainer}>
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

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Contraseña</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Links */}
              <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                  <Text style={styles.link}>Crear una cuenta</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/(auth)/recovery")}>
                  <Text style={styles.link}>Recuperar contraseña</Text>
                </TouchableOpacity>
              </View>
              {/* Botón Login */}
              <TouchableOpacity style={styles.button} onPress={signIn}>
                <Text style={styles.buttonText}>Entrar</Text>
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
  headerText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 24,
    marginLeft: 4,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
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
    marginBottom: 24,
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
  linksContainer: {
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  link: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "500",
    marginVertical: 4,
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
});
