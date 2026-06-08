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
  Menu,
  Search,
  SlidersHorizontal,
  CalendarDays,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  Sparkles,
  Cpu,
  Trophy,
} from "lucide-react-native";

import { colors } from "../styles/colors";

const eventosMock = [
  {
    id: 1,
    titulo: "Workshop de React Native",
    data: "15/09/2026",
    hora: "19h00",
    local: "Auditório IFPE",
    tipo: "Workshop",
    icon: "sparkles",
  },
  {
    id: 2,
    titulo: "Palestra de Inteligência Artificial",
    data: "20/09/2026",
    hora: "18h30",
    local: "Sala 201 - IFPE",
    tipo: "Palestra",
    icon: "cpu",
  },
  {
    id: 3,
    titulo: "Semana de ADS 2026",
    data: "05/10/2026",
    hora: "16h00",
    local: "Campus Recife",
    tipo: "Evento",
    icon: "trophy",
  },
];

export default function EventListScreen({ navigation }) {
  const [busca, setBusca] = useState("");

  function editarEvento(evento) {
    navigation.navigate("EventForm", { evento });
  }

  function excluirEvento(evento) {
    Alert.alert("Excluir evento", `Depois vamos excluir: ${evento.titulo}`);
  }

  function abrirDetalhes(evento) {
    navigation.navigate("EventDetails", {
      evento: {
        ...evento,
        descricao:
          "Aprenda na prática os principais conceitos desse evento acadêmico. A atividade será voltada para tecnologia, inovação e desenvolvimento profissional dos alunos.",
      },
    });
  }

  function renderIcon(tipo) {
    if (tipo === "cpu") {
      return <Cpu size={34} color={colors.white} strokeWidth={2.2} />;
    }

    if (tipo === "trophy") {
      return <Trophy size={34} color={colors.white} strokeWidth={2.2} />;
    }

    return <Sparkles size={34} color={colors.white} strokeWidth={2.2} />;
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
          <TouchableOpacity style={styles.headerButton}>
            <Menu size={23} color={colors.white} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Eventos</Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.searchArea}>
          <View style={styles.searchBox}>
            <Search size={19} color={colors.textMuted} />

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar eventos..."
              placeholderTextColor={colors.textMuted}
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          <TouchableOpacity style={styles.filterButton}>
            <SlidersHorizontal size={21} color={colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Eventos cadastrados</Text>

        <View style={styles.listArea}>
          {eventosMock.map((evento) => (
            <TouchableOpacity
              key={evento.id}
              style={styles.eventCard}
              onPress={() => abrirDetalhes(evento)}
              activeOpacity={0.85}
            >
              <View style={styles.imageBox}>
                {renderIcon(evento.icon)}
                <Text style={styles.imageText}>EVENTADS</Text>
              </View>

              <View style={styles.eventContent}>
                <View style={styles.eventTop}>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {evento.titulo}
                  </Text>
                </View>

                <View style={styles.eventInfoRow}>
                  <CalendarDays size={13} color={colors.textMuted} />
                  <Text style={styles.eventInfoText}>{evento.data}</Text>

                  <Clock size={13} color={colors.textMuted} />
                  <Text style={styles.eventInfoText}>{evento.hora}</Text>
                </View>

                <View style={styles.eventInfoRow}>
                  <MapPin size={13} color={colors.textMuted} />
                  <Text style={styles.eventInfoText}>{evento.local}</Text>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => editarEvento(evento)}
                  >
                    <Pencil size={13} color={colors.white} />
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => excluirEvento(evento)}
                  >
                    <Trash2 size={13} color={colors.white} />
                    <Text style={styles.actionButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
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
    marginBottom: 22,
  },

  headerButton: {
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
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
  },

  headerSpace: {
    width: 44,
  },

  searchArea: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  searchBox: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginRight: 12,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: colors.white,
    fontSize: 14,
  },

  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 14,
  },

  listArea: {
    gap: 16,
  },

  eventCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 12,
  },

  imageBox: {
    width: 96,
    height: 112,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  imageText: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: "bold",
    color: colors.white,
    letterSpacing: 0.5,
  },

  eventContent: {
    flex: 1,
  },

  eventTop: {
    marginBottom: 8,
  },

  eventTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
    lineHeight: 18,
    marginTop: 4,
  },

  eventInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    flexWrap: "wrap",
  },

  eventInfoText: {
    fontSize: 11,
    color: colors.textSoft,
    marginLeft: 5,
    marginRight: 9,
  },

  actionsRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  actionButtonText: {
    marginLeft: 5,
    fontSize: 11,
    color: colors.white,
    fontWeight: "700",
  },
});
