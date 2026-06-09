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
  Bell,
  CalendarDays,
  Clock,
  ListChecks,
  MapPin,
  Plus,
  Sparkles,
} from "lucide-react-native";

import { useFocusEffect } from "@react-navigation/native";

import { colors } from "../styles/colors";

import { auth } from "../services/firebaseConfig";

import api from "../services/api";
import {
  formatarDataHoraEvento,
  getEtiquetaProximoEvento,
  getProximoEvento,
} from "../helpers/eventHelpers";

export default function HomeScreen({ navigation }) {
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
        api.get(`/users?firebaseId=${firebaseUser.uid}`),
        api.get("/events"),
      ]);

      setUsuario(usuarioResponse.data[0] || null);
      setEventos(
        Array.isArray(eventosResponse.data) ? eventosResponse.data : [],
      );
    } catch (error) {
      console.log(error);

      Alert.alert("Erro", "Não foi possível carregar os dados da tela inicial.");
    } finally {
      setLoading(false);
    }
  }
  function novoEvento() {
    navigation.navigate("EventForm");
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
      <View style={{ backgroundColor: colors.background, flex: 1, alignItems: "center", justifyContent: "center" }}>
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
          <View>
            <Text style={styles.greeting}>
              Olá, {usuario?.nome || "Usuário"} 👋
            </Text>
            <Text style={styles.welcome}>Seja bem-vindo ao EventADS</Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={abrirNotificacoes}
          >
            <Bell size={22} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Eventos cadastrados</Text>
              <Text style={styles.cardSubtitle}>
                Total disponível na plataforma
              </Text>
            </View>

            <View style={styles.iconBox}>
              <CalendarDays size={24} color={colors.white} />
            </View>
          </View>

          <Text style={styles.eventNumber}>{totalEventos}</Text>
          <Text style={styles.eventLabel}>
            {totalEventos === 1 ? "evento cadastrado" : "eventos cadastrados"}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximo evento</Text>
          <Text style={styles.sectionAction}>{etiquetaProximoEvento}</Text>
        </View>

        <TouchableOpacity
          style={styles.nextEventCard}
          onPress={abrirProximoEvento}
          activeOpacity={proximoEvento ? 0.85 : 1}
          disabled={!proximoEvento}
        >
          <View style={styles.eventImage}>
            {proximoEvento?.imagem ? (
              <Image
                source={{ uri: proximoEvento.imagem }}
                style={styles.eventPhoto}
                resizeMode="cover"
              />
            ) : (
              <>
                <Sparkles size={28} color={colors.white} />
                <Text style={styles.eventImageText}>ADS</Text>
              </>
            )}
          </View>

          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>
              {proximoEvento?.titulo || "Nenhum evento próximo"}
            </Text>

            {proximoEvento ? (
              <>
                <View style={styles.eventDetail}>
                  <Clock size={14} color={colors.textMuted} />
                  <Text style={styles.eventDetailText}>
                    {formatarDataHoraEvento(proximoEvento)}
                  </Text>
                </View>

                <View style={styles.eventDetail}>
                  <MapPin size={14} color={colors.textMuted} />
                  <Text style={styles.eventDetailText}>
                    {proximoEvento.local || "Local não informado"}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.emptyEventText}>
                Cadastre um novo evento para ele aparecer aqui.
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.actionsArea}>
          <TouchableOpacity style={styles.actionCard} onPress={novoEvento}>
            <View style={styles.actionIconBox}>
              <Plus size={28} color={colors.white} />
            </View>

            <Text style={styles.actionTitle}>Novo Evento</Text>
            <Text style={styles.actionText}>Cadastrar evento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={verEventos}>
            <View style={styles.actionIconBox}>
              <ListChecks size={28} color={colors.white} />
            </View>

            <Text style={styles.actionTitle}>Ver Eventos</Text>
            <Text style={styles.actionText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Resumo acadêmico</Text>
          <Text style={styles.infoText}>
            Gerencie palestras, minicursos, workshops e hackathons em um único
            ambiente.
          </Text>
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

  summaryCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 26,
    padding: 20,
    marginBottom: 22,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.white,
  },

  cardSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  eventNumber: {
    marginTop: 22,
    fontSize: 42,
    fontWeight: "bold",
    color: "#93C5FD",
  },

  eventLabel: {
    fontSize: 13,
    color: colors.textSoft,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.white,
  },

  sectionAction: {
    fontSize: 13,
    fontWeight: "700",
    color: "#93C5FD",
  },

  nextEventCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 14,
    marginBottom: 20,
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

  infoCard: {
    backgroundColor: "rgba(37,99,235,0.18)",
    borderWidth: 1,
    borderColor: "rgba(147,197,253,0.25)",
    borderRadius: 24,
    padding: 18,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 6,
  },

  infoText: {
    fontSize: 13,
    color: colors.textSoft,
    lineHeight: 20,
  },
});
