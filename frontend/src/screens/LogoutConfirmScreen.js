import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react-native";

import { auth } from "../services/firebaseConfig";
import { colors } from "../styles/colors";

export default function LogoutConfirmScreen({ navigation }) {
  const [saindo, setSaindo] = useState(false);

  async function confirmarSaida() {
    try {
      setSaindo(true);

      await signOut(auth);

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log(error);

      setSaindo(false);

      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  }

  function cancelar() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <LogOut size={46} color={colors.white} strokeWidth={2.2} />
          </View>

          <Text style={styles.title}>Deseja sair?</Text>

          <Text style={styles.description}>
            Tem certeza que deseja encerrar sua sessão no EventADS?
          </Text>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={confirmarSaida}
            disabled={saindo}
          >
            <Text style={styles.logoutButtonText}>
              {saindo ? "Saindo..." : "Sair"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelar}
            disabled={saindo}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  circleTop: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primary,
    top: -120,
    right: -120,
    opacity: 0.38,
  },

  circleBottom: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.secondary,
    bottom: -120,
    left: -110,
    opacity: 0.28,
  },

  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 30,
    padding: 26,
    alignItems: "center",
  },

  iconCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "rgba(239,68,68,0.14)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: colors.textSoft,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 280,
    marginBottom: 30,
  },

  logoutButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  logoutButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },

  cancelButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },
});
