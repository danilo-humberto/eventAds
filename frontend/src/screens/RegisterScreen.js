import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";

import {
  ArrowLeft,
  Camera,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react-native";

import { colors } from "../styles/colors";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  function cadastrarUsuario() {
    Alert.alert("Cadastro", "Depois vamos conectar esse cadastro ao Firebase.");
  }

  function adicionarFoto() {
    Alert.alert(
      "Foto de perfil",
      "Depois vamos usar upload de imagem nessa área.",
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.circleTop} />
          <View style={styles.circleBottom} />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={22} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Criar Conta</Text>

            <Text style={styles.subtitle}>
              Preencha seus dados para acessar o EventADS.
            </Text>

            <TouchableOpacity style={styles.photoArea} onPress={adicionarFoto}>
              <View style={styles.photoCircle}>
                <Camera size={34} color={colors.white} strokeWidth={2.2} />
              </View>

              <Text style={styles.photoText}>Adicionar foto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nome completo</Text>

            <View style={styles.inputBox}>
              <UserRound size={20} color={colors.textMuted} />

              <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor={colors.textMuted}
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <Text style={styles.label}>E-mail</Text>

            <View style={styles.inputBox}>
              <Mail size={20} color={colors.textMuted} />

              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
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

            <Text style={styles.label}>Confirmar senha</Text>

            <View style={styles.inputBox}>
              <LockKeyhole size={20} color={colors.textMuted} />

              <TextInput
                style={styles.input}
                placeholder="Confirme sua senha"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!mostrarConfirmarSenha}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />

              <TouchableOpacity
                onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              >
                {mostrarConfirmarSenha ? (
                  <EyeOff size={20} color={colors.textMuted} />
                ) : (
                  <Eye size={20} color={colors.textMuted} />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={cadastrarUsuario}
            >
              <Text style={styles.registerButtonText}>Cadastrar</Text>
            </TouchableOpacity>

            <View style={styles.loginArea}>
              <Text style={styles.loginText}>Já possui conta?</Text>

              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}> Fazer login</Text>
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

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
    justifyContent: "center",
  },

  circleTop: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primary,
    top: -100,
    right: -120,
    opacity: 0.38,
  },

  circleBottom: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.secondary,
    bottom: -100,
    left: -110,
    opacity: 0.32,
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
    marginBottom: 22,
  },

  header: {
    alignItems: "center",
    marginBottom: 26,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSoft,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 310,
  },

  photoArea: {
    alignItems: "center",
    marginTop: 26,
  },

  photoCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.cardStrong,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  photoText: {
    marginTop: 10,
    fontSize: 13,
    color: "#93C5FD",
    fontWeight: "700",
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

  registerButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  registerButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },

  loginArea: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  loginText: {
    fontSize: 13,
    color: colors.textSoft,
  },

  loginLink: {
    fontSize: 13,
    color: "#93C5FD",
    fontWeight: "bold",
  },
});
