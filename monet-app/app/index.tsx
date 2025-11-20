import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      alert("Inicio de sesion fallido: " + error.message);
    }
  };

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);

      if (user) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      alert("Registro fallido: " + error.message);
    }
  };

  return (
    <SafeAreaView>
      <ThemedView>
        <ThemedText type="title">Login</ThemedText>
        <TextInput placeholder="email" value={email} onChangeText={setEmail} />
        <TextInput
          placeholder="password"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={signIn}>
          <Text>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={signUp}>
          <Text>Crear Cuenta</Text>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}
