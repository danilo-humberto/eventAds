import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import {
  CalendarDays,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { signInWithEmailAndPassword } from "@firebase/auth";

import { colors } from "../styles/colors";
import { auth } from "../services/firebaseConfig";
import { registrarPushTokenUsuarioAtual } from "../services/notificationService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha o e-mail e a senha.");
      return;
    }

    try {
      setCarregando(true);

      await signInWithEmailAndPassword(auth, email, senha);
      await registrarPushTokenUsuarioAtual();

      navigation.replace("Main");
    } catch (error) {
      console.log(error);

      let mensagem = "Não foi possível realizar o login.";

      if (error.code === "auth/invalid-email") {
        mensagem = "E-mail inválido.";
      }

      if (error.code === "auth/user-not-found") {
        mensagem = "Usuário não encontrado.";
      }

      if (error.code === "auth/wrong-password") {
        mensagem = "Senha incorreta.";
      }

      if (error.code === "auth/invalid-credential") {
        mensagem = "E-mail ou senha inválidos.";
      }

      Alert.alert("Erro no login", mensagem);
    } finally {
      setCarregando(false);
    }
  }

  function recuperarSenha() {
    navigation.navigate("ForgotPassword");
  }

  function cadastrar() {
    navigation.navigate("Register");
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

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoArea}>
            <View style={styles.logoBox}>
              <CalendarDays size={36} color={colors.white} strokeWidth={2.4} />
            </View>

            <Text style={styles.title}>
              Event<Text style={styles.titleHighlight}>ADS</Text>
            </Text>

            <Text style={styles.subtitle}>Bem-vindo de volta!</Text>

            <Text style={styles.description}>
              Acesse sua conta para gerenciar eventos acadêmicos.
            </Text>
          </View>

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

            <Text style={styles.label}>Senha</Text>

            <View style={styles.inputBox}>
              <LockKeyhole size={20} color={colors.textMuted} />

              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
              />

              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                {mostrarSenha ? (
                  <EyeOff size={20} color={colors.textMuted} />
                ) : (
                  <Eye size={20} color={colors.textMuted} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={recuperarSenha}>
              <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={entrar}
              disabled={carregando}
            >
              <Text style={styles.loginButtonText}>
                {carregando ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>

            <View style={styles.registerArea}>
              <Text style={styles.registerText}>Não possui conta?</Text>

              <TouchableOpacity onPress={cadastrar}>
                <Text style={styles.registerLink}> Cadastre-se</Text>
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
    top: -100,
    right: -100,
    opacity: 0.38,
  },

  circleBottom: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.secondary,
    bottom: -90,
    left: -90,
    opacity: 0.32,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "center",
  },

  logoArea: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoBox: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor: colors.cardStrong,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.white,
  },

  titleHighlight: {
    color: "#93C5FD",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "700",
    color: colors.white,
  },

  description: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textSoft,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 310,
  },

  form: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
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

  forgotText: {
    color: "#93C5FD",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 18,
  },

  loginButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },

  registerArea: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  registerText: {
    fontSize: 13,
    color: colors.textSoft,
  },

  registerLink: {
    fontSize: 13,
    color: "#93C5FD",
    fontWeight: "bold",
  },
});
