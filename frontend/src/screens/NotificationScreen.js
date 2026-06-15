import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import {
  Bell,
  CalendarPlus,
  Clock,
  PartyPopper,
  RefreshCcw,
  Trash2,
} from "lucide-react-native";

import api from "../services/api";
import { auth } from "../services/firebaseConfig";
import { colors } from "../styles/colors";

function formatarTempo(createdAt) {
  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return "Agora";
  }

  const diffMinutes = Math.max(
    0,
    Math.floor((Date.now() - createdDate.getTime()) / 60000),
  );

  if (diffMinutes < 1) {
    return "Agora";
  }

  if (diffMinutes < 60) {
    return diffMinutes === 1 ? "1 min atrás" : `${diffMinutes} min atrás`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return diffHours === 1 ? "1 hora atrás" : `${diffHours} horas atrás`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return diffDays === 1 ? "1 dia atrás" : `${diffDays} dias atrás`;
}

export default function NotificationScreen() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarNotificacoes();
    }, []),
  );

  async function carregarNotificacoes() {
    try {
      setLoading(true);

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        setNotificacoes([]);

        return;
      }

      const response = await api.get(
        `/notifications?userId=${firebaseUser.uid}`,
      );
      const notifications = Array.isArray(response.data) ? response.data : [];

      setNotificacoes(
        notifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
      );
    } catch (error) {
      console.log(error);

      Alert.alert("Erro", "Não foi possível carregar as notificações.");
    } finally {
      setLoading(false);
    }
  }

  async function apagarNotificacao(notificationId) {
    try {
      await api.delete(`/notifications/${notificationId}`);

      setNotificacoes((notificacoesAtuais) =>
        notificacoesAtuais.filter(
          (notificacao) => String(notificacao.id) !== String(notificationId),
        ),
      );
    } catch (error) {
      console.log(error);

      Alert.alert("Erro", "Não foi possível apagar a notificação.");
    }
  }

  function limparNotificacoes() {
    if (notificacoes.length === 0) {
      return;
    }

    Alert.alert(
      "Limpar notificações",
      "Deseja remover todas as notificações salvas?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              await Promise.all(
                notificacoes.map((notificacao) =>
                  api.delete(`/notifications/${notificacao.id}`),
                ),
              );

              setNotificacoes([]);
            } catch (error) {
              console.log(error);

              Alert.alert("Erro", "Não foi possível limpar as notificações.");
            }
          },
        },
      ],
    );
  }

  function renderIcon(tipo) {
    if (tipo === "atualizado") {
      return <RefreshCcw size={22} color={colors.white} />;
    }

    if (tipo === "lembrete") {
      return <Clock size={22} color={colors.white} />;
    }

    if (tipo === "excluido") {
      return <Trash2 size={22} color={colors.white} />;
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

    if (tipo === "excluido") {
      return [styles.iconBox, styles.iconRed];
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
              {notificacoes.length} notificações
            </Text>
            <Text style={styles.summaryText}>
              Cadastros, alterações, exclusões e lembretes recentes.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recentes</Text>

          <TouchableOpacity
            onPress={limparNotificacoes}
            disabled={notificacoes.length === 0}
          >
            <Text
              style={[
                styles.clearText,
                notificacoes.length === 0 && styles.clearTextDisabled,
              ]}
            >
              Limpar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listArea}>
          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Carregando notificações...</Text>
            </View>
          ) : notificacoes.length === 0 ? (
            <View style={styles.emptyCard}>
              <Bell size={26} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Nenhuma notificação </Text>
            </View>
          ) : (
            notificacoes.map((item) => (
              <View key={item.id} style={styles.notificationCard}>
                <View style={getIconStyle(item.tipo)}>
                  {renderIcon(item.tipo)}
                </View>

                <View style={styles.notificationContent}>
                  <View style={styles.notificationTop}>
                    <Text style={styles.notificationTitle}>{item.titulo}</Text>

                    <TouchableOpacity
                      onPress={() => apagarNotificacao(item.id)}
                    >
                      <Trash2 size={16} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.notificationMessage}>
                    {item.mensagem}
                  </Text>
                  <Text style={styles.notificationDetail}>{item.detalhe}</Text>
                  <Text style={styles.notificationTime}>
                    {item.tempo || formatarTempo(item.createdAt)}
                  </Text>
                </View>
              </View>
            ))
          )}
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

  clearTextDisabled: {
    color: colors.textMuted,
  },

  listArea: {
    gap: 14,
  },

  loadingCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: colors.textSoft,
  },

  emptyCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textSoft,
    textAlign: "center",
    lineHeight: 18,
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

  iconRed: {
    backgroundColor: colors.danger,
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
