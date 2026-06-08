import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";

import {
  Bell,
  CalendarPlus,
  RefreshCcw,
  Trash2,
  PartyPopper,
  Clock,
} from "lucide-react-native";

import { colors } from "../styles/colors";

const notificacoesMock = [
  {
    id: 1,
    titulo: "Novo evento cadastrado!",
    mensagem: "Workshop de React Native foi adicionado.",
    detalhe: "15/09/2026 às 19h no Auditório IFPE.",
    tempo: "Agora",
    tipo: "novo",
  },
  {
    id: 2,
    titulo: "Evento atualizado",
    mensagem: "Palestra de IA foi atualizada.",
    detalhe: "As informações do evento foram modificadas.",
    tempo: "10 min atrás",
    tipo: "atualizado",
  },
  {
    id: 3,
    titulo: "Lembrete de evento",
    mensagem: "Semana de ADS 2026 começa hoje!",
    detalhe: "14h00 no Campus Recife.",
    tempo: "1 dia atrás",
    tipo: "lembrete",
  },
  {
    id: 4,
    titulo: "Novo evento cadastrado!",
    mensagem: "Palestra de Cibersegurança adicionada.",
    detalhe: "22/09/2026 às 18h.",
    tempo: "2 dias atrás",
    tipo: "novo",
  },
];

export default function NotificationScreen() {
  function renderIcon(tipo) {
    if (tipo === "atualizado") {
      return <RefreshCcw size={22} color={colors.white} />;
    }

    if (tipo === "lembrete") {
      return <Clock size={22} color={colors.white} />;
    }

    return <CalendarPlus size={22} color={colors.white} />;
  }

  function getIconStyle(tipo) {
    if (tipo === "atualizado") {
      return [styles.iconBox, styles.iconGreen];
    }

    if (tipo === "lembrete") {
      return [styles.iconBox, styles.iconOrange];
    }

    return [styles.iconBox, styles.iconBlue];
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
            <Text style={styles.headerTitle}>Notificações</Text>
            <Text style={styles.headerSubtitle}>
              Acompanhe os avisos dos eventos
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Bell size={24} color={colors.white} />
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <PartyPopper size={24} color={colors.white} />
          </View>

          <View style={styles.summaryTextArea}>
            <Text style={styles.summaryTitle}>
              {notificacoesMock.length} notificações
            </Text>
            <Text style={styles.summaryText}>
              Eventos cadastrados, alterações e lembretes recentes.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recentes</Text>

          <TouchableOpacity>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listArea}>
          {notificacoesMock.map((item) => (
            <View key={item.id} style={styles.notificationCard}>
              <View style={getIconStyle(item.tipo)}>
                {renderIcon(item.tipo)}
              </View>

              <View style={styles.notificationContent}>
                <View style={styles.notificationTop}>
                  <Text style={styles.notificationTitle}>{item.titulo}</Text>

                  <TouchableOpacity>
                    <Trash2 size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.notificationMessage}>{item.mensagem}</Text>
                <Text style={styles.notificationDetail}>{item.detalhe}</Text>
                <Text style={styles.notificationTime}>{item.tempo}</Text>
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

  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.white,
  },

  headerSubtitle: {
    marginTop: 5,
    fontSize: 13,
    color: colors.textSoft,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
  },

  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  summaryTextArea: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },

  summaryText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSoft,
    lineHeight: 18,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.white,
  },

  clearText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#93C5FD",
  },

  listArea: {
    gap: 14,
  },

  notificationCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 14,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  iconBlue: {
    backgroundColor: colors.primary,
  },

  iconGreen: {
    backgroundColor: "#16A34A",
  },

  iconOrange: {
    backgroundColor: "#F97316",
  },

  notificationContent: {
    flex: 1,
  },

  notificationTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  notificationTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
    marginRight: 8,
  },

  notificationMessage: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  notificationDetail: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSoft,
    lineHeight: 18,
  },

  notificationTime: {
    marginTop: 8,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
});
