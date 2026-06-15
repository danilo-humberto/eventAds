import axios from "axios";

const api = axios.create({
  baseURL: "http://10.226.143.128:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
