import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from "react-native";

import { CalendarDays, GraduationCap } from "lucide-react-native";
import { onAuthStateChanged } from "@firebase/auth";

import { auth } from "../services/firebaseConfig";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    let authResolved = false;
    let timerFinished = false;
    let nextRoute = "Login";

    function navigateWhenReady() {
      if (!authResolved || !timerFinished) {
        return;
      }

      navigation.replace(nextRoute);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      authResolved = true;
      nextRoute = user ? "Main" : "Login";

      navigateWhenReady();
    });

    const timer = setTimeout(() => {
      timerFinished = true;

      navigateWhenReady();
    }, 2000);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <View style={styles.content}>
        <View style={styles.logoBox}>
          <CalendarDays size={54} color="#FFFFFF" strokeWidth={2.2} />

          <View style={styles.badge}>
            <GraduationCap size={20} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </View>

        <Text style={styles.title}>EventADS</Text>

        <Text style={styles.subtitle}>Gestão de Eventos Acadêmicos</Text>

        <Text style={styles.description}>
          Palestras, minicursos, workshops e tecnologia em um só lugar.
        </Text>

        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>

      <Text style={styles.footerText}>ADS • Eventos • Tecnologia</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingHorizontal: 24,
  },

  circleTop: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#2563EB",
    top: -100,
    right: -100,
    opacity: 0.38,
  },

  circleBottom: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#7C3AED",
    bottom: -90,
    left: -90,
    opacity: 0.32,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logoBox: {
    width: 118,
    height: 118,
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  badge: {
    position: "absolute",
    right: -8,
    bottom: -8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#0F172A",
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#BFDBFE",
    fontWeight: "700",
    marginBottom: 14,
  },

  description: {
    fontSize: 14,
    color: "#CBD5E1",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 310,
  },

  loadingBox: {
    marginTop: 44,
    alignItems: "center",
  },

  loadingText: {
    color: "#E5E7EB",
    fontSize: 13,
    marginTop: 12,
  },

  footerText: {
    textAlign: "center",
    color: "#93C5FD",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 28,
  },
});
