import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATIONS_STORAGE_KEY = "@eventads:notificacoes";
const MAX_STORED_NOTIFICATIONS = 50;

export async function getStoredNotifications() {
  try {
    const storedNotifications = await AsyncStorage.getItem(
      NOTIFICATIONS_STORAGE_KEY,
    );

    if (!storedNotifications) {
      return [];
    }

    const parsedNotifications = JSON.parse(storedNotifications);

    return Array.isArray(parsedNotifications) ? parsedNotifications : [];
  } catch (error) {
    console.log(error);

    return [];
  }
}

export async function addStoredNotification(notification) {
  const currentNotifications = await getStoredNotifications();
  const now = new Date().toISOString();
  const newNotification = {
    id: notification.id || `${Date.now()}`,
    tipo: notification.tipo || "novo",
    titulo: notification.titulo,
    mensagem: notification.mensagem,
    detalhe: notification.detalhe,
    createdAt: notification.createdAt || now,
  };
  const updatedNotifications = [
    newNotification,
    ...currentNotifications,
  ].slice(0, MAX_STORED_NOTIFICATIONS);

  await AsyncStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(updatedNotifications),
  );

  return newNotification;
}

export async function removeStoredNotification(notificationId) {
  const currentNotifications = await getStoredNotifications();
  const updatedNotifications = currentNotifications.filter(
    (notification) => String(notification.id) !== String(notificationId),
  );

  await AsyncStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(updatedNotifications),
  );

  return updatedNotifications;
}

export async function clearStoredNotifications() {
  await AsyncStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);

  return [];
}
