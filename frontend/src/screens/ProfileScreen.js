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
  UserRound,
  Pencil,
  CalendarDays,
  Bell,
  LockKeyhole,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react-native";

import { colors } from "../styles/colors";

export default function ProfileScreen({ navigation }) {
  function editarPerfil() {
    navigation.navigate("EditProfile");
  }

  function meusEventos() {
    Alert.alert(
      "Meus eventos",
      "Depois vamos filtrar os eventos cadastrados pelo usuário.",
    );
  }

  function sairDaConta() {
    navigation.navigate("LogoutConfirm");
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
          <View style={styles.headerSpace} />

          <Text style={styles.headerTitle}>Meu Perfil</Text>

          <TouchableOpacity
            style={styles.editHeaderButton}
            onPress={editarPerfil}
          >
            <Pencil size={19} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarArea}>
            <View style={styles.avatar}>
              <UserRound size={48} color={colors.white} strokeWidth={2.1} />
            </View>

            <View style={styles.verifiedBadge}>
              <ShieldCheck size={17} color={colors.white} strokeWidth={2.4} />
            </View>
          </View>

          <Text style={styles.userName}>João Silva</Text>
          <Text style={styles.userEmail}>joaosilva@email.com</Text>
        </View>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={meusEventos}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconBox}>
                <CalendarDays size={21} color="#93C5FD" />
              </View>

              <View>
                <Text style={styles.menuTitle}>Meus Eventos</Text>
                <Text style={styles.menuSubtitle}>12 eventos cadastrados</Text>
              </View>
            </View>

            <ChevronRight size={21} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={sairDaConta}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconBox, styles.logoutIconBox]}>
                <LogOut size={21} color={colors.danger} />
              </View>

              <View>
                <Text style={styles.logoutTitle}>Sair da Conta</Text>
                <Text style={styles.menuSubtitle}>Encerrar sessão atual</Text>
              </View>
            </View>

            <ChevronRight size={21} color={colors.textMuted} />
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
    marginBottom: 28,
  },

  headerSpace: {
    width: 44,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: colors.white,
  },

  editHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  profileCard: {
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
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.cardStrong,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  verifiedBadge: {
    position: "absolute",
    right: 0,
    bottom: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  userName: {
    fontSize: 21,
    color: colors.white,
    fontWeight: "bold",
  },

  userEmail: {
    marginTop: 5,
    fontSize: 13,
    color: colors.textSoft,
  },

  menuCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    paddingVertical: 6,
    marginBottom: 22,
  },

  menuItem: {
    minHeight: 72,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  menuIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(147,197,253,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  logoutIconBox: {
    backgroundColor: "rgba(239,68,68,0.12)",
  },

  menuTitle: {
    fontSize: 14,
    color: colors.white,
    fontWeight: "bold",
  },

  logoutTitle: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: "bold",
  },

  menuSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 77,
  },
});
