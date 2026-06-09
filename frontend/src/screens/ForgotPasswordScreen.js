import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";

import { ArrowLeft, LockKeyhole, Mail, Send } from "lucide-react-native";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../services/firebaseConfig";
import { colors } from "../styles/colors";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviarInstrucoes() {
    const emailFormatado = email.trim();

    if (!emailFormatado) {
      Alert.alert("Atenção", "Digite seu e-mail para recuperar a senha.");
      return;
    }

    try {
      setEnviando(true);

      await sendPasswordResetEmail(auth, emailFormatado);

      Alert.alert(
        "E-mail enviado",
        "Enviamos as instruções de recuperação para o e-mail informado.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.log(error);

      let mensagem = "Não foi possível enviar as instruções de recuperação.";

      if (error.code === "auth/invalid-email") {
        mensagem = "Digite um e-mail válido.";
      }

      if (error.code === "auth/user-not-found") {
        mensagem = "Não encontramos uma conta com esse e-mail.";
      }

      if (error.code === "auth/network-request-failed") {
        mensagem =
          "Não foi possível conectar ao Firebase. Verifique sua internet e tente novamente.";
      }

      Alert.alert("Erro", mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.circleTop} />
        <View style={styles.circleBottom} />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color={colors.white} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Recuperar Senha</Text>

          <View style={styles.headerSpace} />
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.iconArea}>
              <View style={styles.iconBox}>
                <LockKeyhole size={42} color={colors.white} strokeWidth={2.2} />
              </View>
            </View>

            <Text style={styles.title}>Esqueceu sua senha?</Text>

            <Text style={styles.subtitle}>
              Digite seu e-mail para receber as instruções de recuperação da sua
              conta.
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>E-mail</Text>

              <View style={styles.inputBox}>
                <Mail size={20} color={colors.textMuted} />

                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  enviando && styles.sendButtonDisabled,
                ]}
                onPress={enviarInstrucoes}
                disabled={enviando}
              >
                <Send size={18} color={colors.white} />
                <Text style={styles.sendButtonText}>
                  {enviando ? "Enviando..." : "Enviar instruções"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.loginButtonText}>Voltar para o login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardArea: {
    flex: 1,
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

  header: {
    marginTop: 45,
    marginHorizontal: 24,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  scrollArea: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    justifyContent: "center",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: colors.white,
  },

  headerSpace: {
    width: 44,
  },

  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 30,
    padding: 24,
  },

  iconArea: {
    alignItems: "center",
    marginBottom: 20,
  },

  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.cardStrong,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSoft,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 26,
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },

  inputBox: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: colors.white,
    marginLeft: 10,
  },

  sendButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 24,
  },

  sendButtonDisabled: {
    opacity: 0.65,
  },

  sendButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },

  loginButton: {
    alignItems: "center",
    marginTop: 22,
  },

  loginButtonText: {
    fontSize: 13,
    color: "#93C5FD",
    fontWeight: "bold",
  },
});
