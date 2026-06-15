import api from "../services/api";

export function getUsers() {
  return api.get("/users");
}

export function getUserByFirebaseId(firebaseId) {
  return api.get(`/users?firebaseId=${firebaseId}`);
}

export function createUser(user) {
  return api.post("/users", user);
}

export function updateUser(userId, data) {
  return api.patch(`/users/${userId}`, data);
}
