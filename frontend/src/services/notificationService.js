import { Platform } from "react-native";

import axios from "axios";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { createNotification } from "../api/notifications.api";
import { getUserByFirebaseId, getUsers, updateUser } from "../api/users.api";
import { auth } from "./firebaseConfig";

const EXPO_PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";
const NOTIFICATION_CHANNEL_ID = "eventads-default";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function getProjectId() {
  return (
    Constants?.expoConfig?.extra?.eas?.projectId ||
    Constants?.easConfig?.projectId
  );
}

function getNotificationDetail(evento) {
  const dataHora = [evento?.data, evento?.hora]
    .filter(Boolean)
    .join(" às ");
  const local = evento?.local || "Local não informado";

  return dataHora ? `${dataHora} - ${local}` : local;
}

function getNotificationPayload(evento, tipo = "novo") {
  const tituloEvento = evento?.titulo || "Um evento";

  if (tipo === "atualizado") {
    return {
      title: "Evento atualizado",
      body: `${tituloEvento} teve suas informações atualizadas.`,
      data: {
        tela: "EventDetails",
        eventId: evento?.id,
        tipo: "evento-atualizado",
      },
    };
  }

  if (tipo === "excluido") {
    return {
      title: "Evento excluído",
      body: `${tituloEvento} foi removido do EventADS.`,
      data: {
        tela: "Eventos",
        eventId: evento?.id,
        tipo: "evento-excluido",
      },
    };
  }

  return {
    title: "Novo evento cadastrado",
    body: `${tituloEvento} foi adicionado ao EventADS.`,
    data: {
      tela: "EventDetails",
      eventId: evento?.id,
      tipo: "novo-evento",
    },
  };
}

function getUserPushTokens(usuario) {
  const tokens = [];

  if (usuario?.pushToken) {
    tokens.push(usuario.pushToken);
  }

  if (Array.isArray(usuario?.pushTokens)) {
    tokens.push(...usuario.pushTokens);
  }

  return [...new Set(tokens.filter(Boolean))];
}

async function configurarCanalAndroid() {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: "EventADS",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#2563EB",
  });
}

export async function obterExpoPushToken() {
  try {
    if (Platform.OS === "web") {
      return null;
    }

    await configurarCanalAndroid();

    if (!Device.isDevice) {
      console.log("Use um dispositivo físico para obter o Expo Push Token.");

      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Permissão de notificação negada.");

      return null;
    }

    const projectId = getProjectId();

    if (!projectId) {
      console.log("ProjectId não encontrado no app.json.");

      return null;
    }

    const pushToken = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    return pushToken.data;
  } catch (error) {
    console.log(error);

    return null;
  }
}

export async function registrarPushTokenParaUsuario(usuario) {
  try {
    if (!usuario?.id) {
      return null;
    }

    const pushToken = await obterExpoPushToken();

    if (!pushToken) {
      return null;
    }

    const pushTokens = [...new Set([...getUserPushTokens(usuario), pushToken])];

    await updateUser(usuario.id, {
      pushToken,
      pushTokens,
    });

    return pushToken;
  } catch (error) {
    console.log(error);

    return null;
  }
}

export async function registrarPushTokenUsuarioAtual() {
  try {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      return null;
    }

    const response = await getUserByFirebaseId(firebaseUser.uid);
    const usuario = response.data?.[0];

    return registrarPushTokenParaUsuario(usuario);
  } catch (error) {
    console.log(error);

    return null;
  }
}

async function enviarPushNotifications(tokens, notification) {
  const uniqueTokens = [...new Set(tokens.filter(Boolean))];

  if (uniqueTokens.length === 0) {
    return null;
  }

  const messages = uniqueTokens.map((token) => ({
    to: token,
    sound: "default",
    title: notification.title,
    body: notification.body,
    data: notification.data,
  }));

  const response = await axios.post(
    EXPO_PUSH_ENDPOINT,
    messages.length === 1 ? messages[0] : messages,
    {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}

async function criarNotificacoesNoBackend(evento, usuarios, tipo) {
  const notification = getNotificationPayload(evento, tipo);
  const createdAt = new Date().toISOString();
  const notificacoes = usuarios
    .filter((usuario) => usuario?.firebaseId)
    .map((usuario) => ({
      userId: usuario.firebaseId,
      eventId: evento.id,
      tipo,
      titulo: notification.title,
      mensagem: notification.body,
      detalhe: getNotificationDetail(evento),
      lida: false,
      createdAt,
    }));

  await Promise.all(
    notificacoes.map((notificacao) => createNotification(notificacao)),
  );

  return notificacoes;
}

async function notificarEvento(evento, tipo) {
  try {
    if (!evento?.id) {
      return;
    }

    const response = await getUsers();
    const usuarios = Array.isArray(response.data) ? response.data : [];
    const notification = getNotificationPayload(evento, tipo);
    const tokens = usuarios.flatMap(getUserPushTokens);

    await criarNotificacoesNoBackend(evento, usuarios, tipo);
    await enviarPushNotifications(tokens, notification);
  } catch (error) {
    console.log(error);
  }
}

export async function notificarNovoEvento(evento) {
  return notificarEvento(evento, "novo");
}

export async function notificarEventoAtualizado(evento) {
  return notificarEvento(evento, "atualizado");
}

export async function notificarEventoExcluido(evento) {
  return notificarEvento(evento, "excluido");
}
