import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "@/FirebaseConfig";
import { router } from "expo-router";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function MonetRegister() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {

    if (!fullname) {
      alert("Debes ingresar un nombre valido");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      const err = error as FirebaseError;
      let message = "Error al crear la cuenta";

      if (err.code === "auth/email-already-in-use") {
        message = "Este correo ya está registrado";
      } else if (err.code === "auth/invalid-email") {
        message = "Correo electrónico inválido";
      } else if (err.code === "auth/weak-password") {
        message = "La contraseña es muy débil";
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <Text style={styles.welcomeTitle}>Crea tu cuenta</Text>
            <Text style={styles.welcomeSubtitle}>
              Únete para poder controlar tus finanzas de forma segura
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Nombre Completo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre Completo</Text>
              <TextInput
                style={styles.input}
                value={fullname}
                onChangeText={setFullname}
                placeholder="Tu nombre completo"
                placeholderTextColor="#9CA3AF"
              />
            </View>

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
              />
            </View>

            {/* Confirmar Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />
            </View>
          </View>

          {/* Link a Login */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginQuestion}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.link}>Inicia sesión aquí</Text>
            </TouchableOpacity>
          </View>

          {/* Botón Registrarse */}
          <TouchableOpacity style={styles.button} onPress={signUp}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  welcomeSubtitle: {
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
});
