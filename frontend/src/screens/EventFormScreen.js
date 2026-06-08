import React, { useEffect, useState } from "react";
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
  ImagePlus,
  CalendarDays,
  Clock,
  MapPin,
  Tag,
  FileText,
  Type,
} from "lucide-react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

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

export default function EventFormScreen({ navigation, route }) {
  const eventoEdicao = route.params?.evento;
  const modoEdicao = !!eventoEdicao;
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [horaSelecionada, setHoraSelecionada] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarRelogio, setMostrarRelogio] = useState(false);

  useEffect(() => {
    if (eventoEdicao) {
      setTitulo(eventoEdicao.titulo || "");
      setDescricao(eventoEdicao.descricao || "");
      setData(eventoEdicao.data || "");
      setHora(eventoEdicao.hora || "");
      setLocal(eventoEdicao.local || "");
      setCategoria(eventoEdicao.tipo || eventoEdicao.categoria || "");
    }
  }, [eventoEdicao]);

  function selecionarImagem() {
    Alert.alert(
      "Selecionar imagem",
      "Depois vamos ligar essa ação ao Expo Image Picker e Cloudinary.",
    );
  }

  function salvarEvento() {
    if (modoEdicao) {
      Alert.alert(
        "Evento atualizado",
        "Depois vamos atualizar esse evento usando Axios e json-server.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );

      return;
    }

    Alert.alert(
      "Evento cadastrado",
      "Depois vamos salvar esse novo evento usando Axios e json-server.",
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

          <Text style={styles.headerTitle}>
            {modoEdicao ? "Editar Evento" : "Novo Evento"}
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <TouchableOpacity style={styles.uploadBox} onPress={selecionarImagem}>
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

              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setMostrarCalendario(true)}
                activeOpacity={0.8}
              >
                <CalendarDays size={18} color={colors.textMuted} />

                <Text
                  style={[styles.inputText, !data && styles.placeholderText]}
                >
                  {data || "Selecionar data"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>Hora</Text>

              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setMostrarRelogio(true)}
                activeOpacity={0.8}
              >
                <Clock size={18} color={colors.textMuted} />

                <Text
                  style={[styles.inputText, !hora && styles.placeholderText]}
                >
                  {hora || "Selecionar hora"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {mostrarCalendario && (
            <DateTimePicker
              value={dataSelecionada}
              mode="date"
              display="default"
              onChange={alterarData}
            />
          )}

          {mostrarRelogio && (
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
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={salvarEvento}>
            <Text style={styles.saveButtonText}>
              {modoEdicao ? "Atualizar Evento" : "Salvar Evento"}
            </Text>
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
});
