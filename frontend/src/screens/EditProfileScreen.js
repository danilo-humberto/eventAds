import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";

import {
  ArrowLeft,
  Camera,
  UserRound,
  Mail,
  GraduationCap,
  Building2,
  Save,
} from "lucide-react-native";

import { colors } from "../styles/colors";

export default function EditProfileScreen({ navigation }) {
  const [nome, setNome] = useState("João Silva");
  const [email, setEmail] = useState("joaosilva@email.com");

  function alterarFoto() {
    Alert.alert(
      "Alterar foto",
      "Depois vamos ligar essa ação ao upload de imagem.",
    );
  }

  function salvarPerfil() {
    Alert.alert(
      "Perfil atualizado",
      "Dados do perfil atualizados com sucesso.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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

          <Text style={styles.headerTitle}>Editar Perfil</Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.profilePhotoCard}>
          <TouchableOpacity style={styles.avatarArea} onPress={alterarFoto}>
            <View style={styles.avatar}>
              <UserRound size={52} color={colors.white} strokeWidth={2.1} />
            </View>

            <View style={styles.cameraBadge}>
              <Camera size={18} color={colors.white} strokeWidth={2.4} />
            </View>
          </TouchableOpacity>

          <Text style={styles.photoTitle}>Foto de perfil</Text>
          <Text style={styles.photoText}>
            Toque na imagem para alterar sua foto.
          </Text>
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

          <TouchableOpacity style={styles.saveButton} onPress={salvarPerfil}>
            <Save size={18} color={colors.white} />
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 45,
    paddingBottom: 100,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
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
    fontSize: 21,
    fontWeight: "bold",
    color: colors.white,
  },

  headerSpace: {
    width: 44,
  },

  profilePhotoCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    marginBottom: 22,
  },

  avatarArea: {
    position: "relative",
    marginBottom: 16,
  },

  avatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: colors.cardStrong,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  photoTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.white,
  },

  photoText: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textSoft,
    textAlign: "center",
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

  saveButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 26,
  },

  saveButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },

  cancelButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  cancelButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },
});
