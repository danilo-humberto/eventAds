import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import { ArrowLeft, Camera, Mail, Save, UserRound } from "lucide-react-native";

import { colors } from "../styles/colors";

import { auth } from "../services/firebaseConfig";

import api from "../services/api";

import { pickImage, uploadImage } from "../services/cloudinaryConfig";

export default function EditProfileScreen({ navigation }) {
  const [usuarioId, setUsuarioId] = useState(null);

  const [nome, setNome] = useState("");

  const [email, setEmail] = useState("");

  const [foto, setFoto] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarUsuario();
    }, []),
  );

  async function carregarUsuario() {
    try {
      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        return;
      }

      const response = await api.get(`/users?firebaseId=${firebaseUser.uid}`);

      const user = response.data[0];

      if (!user) {
        return;
      }

      setUsuarioId(user.id);

      setNome(user.nome);

      setEmail(user.email);

      setFoto(
        user.foto
          ? {
              uri: user.foto,
            }
          : null,
      );
    } catch (error) {
      console.log(error);

      Alert.alert("Erro", "Não foi possível carregar o perfil.");
    } finally {
      setLoading(false);
    }
  }

  async function alterarFoto() {
    try {
      const image = await pickImage();

      if (!image) {
        return;
      }

      setFoto(image);
    } catch (error) {
      console.log(error);

      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  }

  async function salvarPerfil() {
    try {
      if (!nome) {
        return Alert.alert("Erro", "Preencha o nome.");
      }

      if (!usuarioId) {
        return Alert.alert("Erro", "Perfil do usuario nao encontrado.");
      }

      setSaving(true);

      let imageUrl = foto?.uri || null;

      if (foto && foto.uri && !foto.uri.startsWith("https")) {
        const uploadedImage = await uploadImage(foto);

        imageUrl = uploadedImage.secure_url;
      }

      await api.patch(`/users/${usuarioId}`, {
        nome,
        foto: imageUrl,
      });

      navigation.goBack();
    } catch (error) {
      console.log(error);

      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
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
              {foto?.uri ? (
                <Image source={{ uri: foto.uri }} style={styles.avatarImage} />
              ) : (
                <UserRound size={52} color={colors.white} strokeWidth={2.1} />
              )}
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

          <View style={styles.readOnlyBox}>
            <Mail size={20} color={colors.textMuted} />

            <Text style={styles.readOnlyText}>
              {email || "E-mail nao informado"}
            </Text>
          </View>

          <Text style={styles.readOnlyHint}>campo não editável</Text>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={salvarPerfil}
            disabled={saving}
          >
            <Save size={18} color={colors.white} />

            <Text style={styles.saveButtonText}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Text>
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

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
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
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 54,
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

  readOnlyBox: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    opacity: 0.82,
  },

  readOnlyText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSoft,
    marginLeft: 10,
  },

  readOnlyHint: {
    marginTop: 7,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
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
