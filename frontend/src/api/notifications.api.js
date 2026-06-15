import api from "../services/api";

export function getNotifications() {
  return api.get("/notifications");
}

export function getNotificationsByUserId(userId) {
  return api.get(`/notifications?userId=${userId}`);
}

export function createNotification(notification) {
  return api.post("/notifications", notification);
}

export function deleteNotification(notificationId) {
  return api.delete(`/notifications/${notificationId}`);
}

export function deleteNotifications(notifications) {
  return Promise.all(
    notifications.map((notification) => deleteNotification(notification.id)),
  );
}
