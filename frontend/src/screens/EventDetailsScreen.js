import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Tag,
  Pencil,
  Trash2,
  Sparkles,
} from "lucide-react-native";

import { colors } from "../styles/colors";

export default function EventDetailsScreen({ navigation, route }) {
  const evento = route.params?.evento || {
    titulo: "Workshop de React Native",
    data: "15/09/2026",
    hora: "19h00",
    local: "Auditório IFPE",
    tipo: "Workshop",
    descricao:
      "Aprenda a desenvolver aplicativos móveis utilizando React Native e Expo. O workshop abordará desde a instalação do ambiente até a publicação do aplicativo.",
  };

  function editarEvento() {
    navigation.navigate("EventForm", { evento });
  }

  function excluirEvento() {
    Alert.alert(
      "Excluir evento",
      "Tem certeza que deseja excluir este evento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
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

          <Text style={styles.headerTitle}>Detalhes</Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIconBox}>
            <Sparkles size={44} color={colors.white} strokeWidth={2.2} />
          </View>

          <View style={styles.heroTextArea}>
            <Text style={styles.heroLabel}>EVENTADS</Text>
            <Text style={styles.heroTitle}>{evento.titulo}</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.eventTitle}>{evento.titulo}</Text>

          <View style={styles.infoArea}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <CalendarDays size={18} color="#93C5FD" />
              </View>

              <View>
                <Text style={styles.infoLabel}>Data</Text>
                <Text style={styles.infoText}>{evento.data}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Clock size={18} color="#93C5FD" />
              </View>

              <View>
                <Text style={styles.infoLabel}>Hora</Text>
                <Text style={styles.infoText}>{evento.hora}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <MapPin size={18} color="#93C5FD" />
              </View>

              <View>
                <Text style={styles.infoLabel}>Local</Text>
                <Text style={styles.infoText}>{evento.local}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Tag size={18} color="#93C5FD" />
              </View>

              <View>
                <Text style={styles.infoLabel}>Categoria</Text>
                <Text style={styles.infoText}>{evento.tipo}</Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionArea}>
            <Text style={styles.descriptionTitle}>Descrição</Text>

            <Text style={styles.descriptionText}>
              {evento.descricao ||
                "Evento acadêmico voltado para tecnologia, inovação e desenvolvimento profissional dos alunos."}
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.editButton} onPress={editarEvento}>
              <Pencil size={17} color={colors.white} />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={excluirEvento}
            >
              <Trash2 size={17} color={colors.white} />
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
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

  heroCard: {
    height: 170,
    borderRadius: 28,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    overflow: "hidden",
  },

  heroIconBox: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },

  heroTextArea: {
    flex: 1,
  },

  heroLabel: {
    fontSize: 12,
    color: "#93C5FD",
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },

  heroTitle: {
    fontSize: 22,
    color: colors.white,
    fontWeight: "bold",
    lineHeight: 28,
  },

  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },

  eventTitle: {
    fontSize: 21,
    color: colors.white,
    fontWeight: "bold",
    marginBottom: 20,
  },

  infoArea: {
    gap: 14,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(147,197,253,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "700",
  },

  infoText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "600",
    marginTop: 2,
  },

  descriptionArea: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  descriptionTitle: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "bold",
    marginBottom: 8,
  },

  descriptionText: {
    fontSize: 14,
    color: colors.textSoft,
    lineHeight: 22,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 26,
  },

  editButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.danger,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  editButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },

  deleteButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
