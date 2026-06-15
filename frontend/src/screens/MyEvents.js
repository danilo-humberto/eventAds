import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useCallback, useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Pencil,
  Plus,
  Trash2
} from "lucide-react-native";

import { useFocusEffect } from "@react-navigation/native";

import { getEvents } from "../api/events.api";
import { getUserByFirebaseId } from "../api/users.api";
import { colors } from "../styles/colors";

import { auth } from "../services/firebaseConfig";

import {
  getEtiquetaProximoEvento,
  getProximoEvento
} from "../helpers/eventHelpers";
import api from "../services/api";

export default function MyEvents({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const proximoEvento = getProximoEvento(eventos);
  const totalEventos = eventos.length;
  const etiquetaProximoEvento = proximoEvento
    ? getEtiquetaProximoEvento(proximoEvento)
    : "Sem evento";

  useFocusEffect(
    useCallback(() => {
      carregarDadosHome();
    }, []),
  );

  async function carregarDadosHome() {
    try {
      setLoading(true);

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        setUsuario(null);
        setEventos([]);

        return;
      }

      const [usuarioResponse, eventosResponse] = await Promise.all([
        getUserByFirebaseId(firebaseUser.uid),
        getEvents(),
      ]);

      setUsuario(usuarioResponse.data[0] || null);
      const todosEventos = Array.isArray(eventosResponse.data)
        ? eventosResponse.data
        : [];

      const eventosUsuario = todosEventos.filter(
        (evento) => evento.userId === firebaseUser.uid,
      );

      setEventos(eventosUsuario);
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível carregar os dados da tela inicial.",
      );
    } finally {
      setLoading(false);
    }
  }
  function novoEvento() {
    navigation.navigate("EventForm");
  }

  function editarEvento(evento) {
    navigation.navigate("EventForm", { evento });
  }

  async function excluirEvento(id) {
    try {
      await api.delete(`/events/${id}`);

      setEventos((prev) => prev.filter((evento) => evento.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  function verEventos() {
    navigation.navigate("Eventos");
  }

  function abrirNotificacoes() {
    navigation.navigate("Notificações");
  }

  function abrirProximoEvento() {
    if (!proximoEvento) {
      return;
    }

    navigation.navigate("EventDetails", { evento: proximoEvento });
  }

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: colors.background,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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

          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.greeting}>
              Olá, {usuario?.nome || "Usuário"} 👋
            </Text>

            <Text style={styles.welcome}>Gerencie seus eventos</Text>
          </View>
        </View>

        <View style={styles.actionsArea}>
          <TouchableOpacity style={styles.actionCard} onPress={novoEvento}>
            <View style={styles.actionIconBox}>
              <Plus size={28} color={colors.white} />
            </View>

            <Text style={styles.actionTitle}>Novo Evento</Text>
            <Text style={styles.actionText}>Cadastrar evento</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventsArea}>
          {eventos.map((evento) => (
            <View key={evento.id} style={styles.eventCard}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate("EventDetails", { evento })}
              >
                <Image
                  source={{
                    uri: evento.imagem || "https://via.placeholder.com/400x200",
                  }}
                  style={styles.eventImage}
                />

                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{evento.titulo}</Text>

                  <View style={styles.infoRow}>
                    <CalendarDays size={15} color="#93C5FD" />

                    <Text style={styles.infoText}>{evento.data}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MapPin size={15} color="#93C5FD" />

                    <Text style={styles.infoText}>{evento.local}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => editarEvento(evento)}
                >
                  <Pencil size={16} color={colors.white} />

                  <Text style={styles.actionTextButton}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => excluirEvento(evento.id)}
                >
                  <Trash2 size={16} color={colors.white} />

                  <Text style={styles.actionTextButton}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    paddingBottom: 28,
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

  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
  },

  welcome: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSoft,
  },

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  eventImage: {
    width: 94,
    height: 94,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    overflow: "hidden",
  },

  eventPhoto: {
    width: "100%",
    height: "100%",
  },

  eventImageText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "bold",
    color: colors.white,
  },

  eventInfo: {
    flex: 1,
    justifyContent: "center",
  },

  eventTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 10,
  },

  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  eventDetailText: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.textSoft,
  },

  emptyEventText: {
    fontSize: 12,
    color: colors.textSoft,
    lineHeight: 18,
  },

  actionsArea: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 20,
  },

  actionCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
  },

  actionIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  actionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
  },

  actionText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  createButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  createButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
  },

  eventsArea: {
    gap: 18,
  },

  eventCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },

  eventImage: {
    width: "100%",
    height: 180,
  },

  eventContent: {
    padding: 16,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  infoText: {
    marginLeft: 8,
    color: colors.textSoft,
    fontSize: 13,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    paddingTop: 0,
  },

  editButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.danger,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  actionTextButton: {
    color: colors.white,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
