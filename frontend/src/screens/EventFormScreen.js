import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  FileText,
  ImagePlus,
  MapPin,
  Type,
} from "lucide-react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import api from "../services/api";
import { pickImage, uploadCompleto } from "../services/cloudinaryConfig";
import { auth } from "../services/firebaseConfig";
import {
  notificarEventoAtualizado,
  notificarNovoEvento,
} from "../services/notificationService";
import { colors } from "../styles/colors";

function formatarData(date) {
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

function formatarHora(date) {
  const horas = String(date.getHours()).padStart(2, "0");
  const minutos = String(date.getMinutes()).padStart(2, "0");

  return `${horas}:${minutos}`;
}

export default function EventFormScreen({ navigation, route }) {
  const eventoEdicao = route.params?.evento;
  const modoEdicao = !!eventoEdicao;
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [horaSelecionada, setHoraSelecionada] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarRelogio, setMostrarRelogio] = useState(false);
  const [scrollBottomPadding, setScrollBottomPadding] = useState(100);
  const scrollViewRef = useRef(null);

  function alterarData(event, selectedDate) {
    if (Platform.OS === "android") {
      setMostrarCalendario(false);
    }

    if (selectedDate) {
      setDataSelecionada(selectedDate);
      setData(formatarData(selectedDate));
    }
  }

  function alterarHora(event, selectedTime) {
    if (Platform.OS === "android") {
      setMostrarRelogio(false);
    }

    if (selectedTime) {
      setHoraSelecionada(selectedTime);
      setHora(formatarHora(selectedTime));
    }
  }

  useEffect(() => {
    if (eventoEdicao) {
      setImagem(eventoEdicao.imagem ? { uri: eventoEdicao.imagem } : null);
      setTitulo(eventoEdicao.titulo || "");
      setDescricao(eventoEdicao.descricao || "");
      setData(eventoEdicao.data || "");
      setHora(eventoEdicao.hora || "");
      setLocal(eventoEdicao.local || "");
    }
  }, [eventoEdicao]);

  async function selecionarImagem() {
    try {
      const photo = await pickImage();

      if (!photo) {
        return;
      }

      setImagem(photo);
    } catch (error) {
      console.log(error);

      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  }
  async function salvarEvento() {
    try {
      if (!titulo || !descricao || !data || !hora || !local) {
        Alert.alert("Campos obrigatórios", "Preencha todos os campos.");

        return;
      }

      setLoading(true);

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        Alert.alert("Erro", "Usuário não autenticado.");

        return;
      }

      if (modoEdicao && eventoEdicao?.userId !== firebaseUser.uid) {
        Alert.alert("Permissão negada", "Apenas o criador pode editar este evento.");

        return;
      }

      let imageUrl = "";

      if (imagem) {
        const imagemEhNova =
          imagem.assetId || imagem.fileName || imagem.mimeType;

        if (imagemEhNova) {
          const uploadedImage = await uploadCompleto(imagem);

          imageUrl = uploadedImage.secure_url;
        } else {
          imageUrl = imagem.uri;
        }
      }

      const novoEvento = {
        titulo,
        descricao,
        data,
        hora,
        local,
        imagem: imageUrl,
        userId: eventoEdicao?.userId || firebaseUser.uid,
        createdAt: eventoEdicao?.createdAt || new Date().toISOString(),
      };

      if (modoEdicao) {
        const response = await api.put(`/events/${eventoEdicao.id}`, {
          ...eventoEdicao,
          ...novoEvento,
        });
        const eventoAtualizado = response.data || {
          ...eventoEdicao,
          ...novoEvento,
        };

        try {
          await notificarEventoAtualizado(eventoAtualizado);
        } catch (notificationError) {
          console.log(notificationError);
        }

        Alert.alert("Sucesso", "Evento atualizado com sucesso.");

        navigation.goBack();

        return;
      }

      const response = await api.post("/events", novoEvento);
      const eventoCriado = response.data || novoEvento;

      try {
        await notificarNovoEvento(eventoCriado);
      } catch (notificationError) {
        console.log(notificationError);
      }

      Alert.alert("Sucesso", "Evento cadastrado com sucesso.");

      navigation.goBack();
    } catch (error) {
      console.log(error);

      Alert.alert("Erro", "Não foi possível salvar o evento.");
    } finally {
      setLoading(false);
    }
  }

  const isWeb = Platform.OS === "web";
  const iconSize = isWeb ? 22 : 18;

  function formatarInputData(texto) {
    const numeros = texto.replace(/\D/g, "");

    if (numeros.length <= 2) {
      return numeros;
    }

    if (numeros.length <= 4) {
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    }

    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  }

  function formatarInputHora(texto) {
    const numeros = texto.replace(/\D/g, "");

    if (numeros.length <= 2) {
      return numeros;
    }

    return `${numeros.slice(0, 2)}:${numeros.slice(2, 4)}`;
  }

  function focarCampoFinal() {
    if (Platform.OS === "web") {
      return;
    }

    setScrollBottomPadding(280);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 250);
  }

  function desfocarCampoFinal() {
    setScrollBottomPadding(100);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: scrollBottomPadding },
          ]}
          keyboardShouldPersistTaps="handled"
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

          <Text style={styles.headerTitle}>
            {modoEdicao ? "Editar Evento" : "Novo Evento"}
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <TouchableOpacity style={styles.uploadBox} onPress={selecionarImagem}>
          {imagem ? (
            <Image source={{ uri: imagem.uri }} style={styles.previewImage} />
          ) : (
            <>
              <View style={styles.uploadIconBox}>
                <ImagePlus size={34} color={colors.white} />
              </View>

              <Text style={styles.uploadTitle}>
                {modoEdicao ? "Alterar imagem" : "Selecionar imagem"}
              </Text>

              <Text style={styles.uploadText}>
                {modoEdicao
                  ? "Toque para escolher uma nova imagem do evento"
                  : "Toque para escolher uma imagem do evento"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Título do evento</Text>

          <View style={styles.inputBox}>
            <Type size={19} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Digite o título"
              placeholderTextColor={colors.textMuted}
              value={titulo}
              onChangeText={setTitulo}
            />
          </View>

          <Text style={styles.label}>Descrição</Text>

          <View style={styles.textAreaBox}>
            <FileText
              size={19}
              color={colors.textMuted}
              style={styles.textAreaIcon}
            />

            <TextInput
              style={styles.textArea}
              placeholder="Descreva o evento"
              placeholderTextColor={colors.textMuted}
              value={descricao}
              onChangeText={setDescricao}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Data</Text>

              {isWeb ? (
                <View style={styles.inputBox}>
                  <View style={styles.iconContainer}>
                    <CalendarDays size={iconSize} color={colors.textMuted} />
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 15/09/2026"
                    placeholderTextColor={colors.textMuted}
                    value={data}
                    onChangeText={(texto) => setData(formatarInputData(texto))}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.inputBox}
                  onPress={() => setMostrarCalendario(true)}
                  activeOpacity={0.8}
                >
                  <CalendarDays size={iconSize} color={colors.textMuted} />

                  <Text
                    style={[styles.inputText, !data && styles.placeholderText]}
                  >
                    {data || "Selecionar data"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>Hora</Text>

              {isWeb ? (
                <View style={styles.inputBox}>
                  <View style={styles.iconContainer}>
                    <Clock size={iconSize} color={colors.textMuted} />
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 19:00"
                    placeholderTextColor={colors.textMuted}
                    value={hora}
                    onChangeText={(texto) => setHora(formatarInputHora(texto))}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.inputBox}
                  onPress={() => setMostrarRelogio(true)}
                  activeOpacity={0.8}
                >
                  <Clock size={iconSize} color={colors.textMuted} />

                  <Text
                    style={[styles.inputText, !hora && styles.placeholderText]}
                  >
                    {hora || "Selecionar hora"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {!isWeb && mostrarCalendario && (
            <DateTimePicker
              value={dataSelecionada}
              mode="date"
              display="default"
              onChange={alterarData}
            />
          )}

          {!isWeb && mostrarRelogio && (
            <DateTimePicker
              value={horaSelecionada}
              mode="time"
              display="default"
              onChange={alterarHora}
            />
          )}

          <Text style={styles.label}>Local</Text>

          <View style={styles.inputBox}>
            <MapPin size={19} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Digite o local"
              placeholderTextColor={colors.textMuted}
              value={local}
              onChangeText={setLocal}
              onFocus={focarCampoFinal}
              onBlur={desfocarCampoFinal}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={salvarEvento}>
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>
                {modoEdicao ? "Atualizar Evento" : "Salvar Evento"}
              </Text>
            )}
          </TouchableOpacity>
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
    paddingTop: 45,
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

  uploadBox: {
    height: 150,
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#93C5FD",
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  uploadIconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.cardStrong,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  uploadTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.white,
  },

  uploadText: {
    marginTop: 5,
    fontSize: 12,
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

  inputText: {
    flex: 1,
    fontSize: 14,
    color: colors.white,
    marginLeft: 10,
  },

  placeholderText: {
    color: colors.textMuted,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: colors.white,
    marginLeft: 10,
    height: "100%",
    paddingVertical: 0,
  },

  iconContainer: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  textAreaBox: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.inputBackground,
  },

  textAreaIcon: {
    marginTop: 0,
  },

  textArea: {
    flex: 1,
    minHeight: 82,
    fontSize: 14,
    color: colors.white,
    marginLeft: 10,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: "top",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  halfInput: {
    flex: 1,
  },

  saveButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
  },

  saveButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
});
