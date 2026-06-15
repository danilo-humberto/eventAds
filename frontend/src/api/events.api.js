import api from "../services/api";

export function getEvents() {
  return api.get("/events");
}

export function getEventsByUserId(userId) {
  return api.get(`/events?userId=${userId}`);
}

export function createEvent(event) {
  return api.post("/events", event);
}

export function updateEvent(eventId, event) {
  return api.put(`/events/${eventId}`, event);
}

export function deleteEvent(eventId) {
  return api.delete(`/events/${eventId}`);
}
