import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqDwi6eof850AQPaNU6B70snOva28BJvE",
  authDomain: "auth-class-06.firebaseapp.com",
  projectId: "auth-class-06",
  storageBucket: "auth-class-06.firebasestorage.app",
  messagingSenderId: "909537150948",
  appId: "1:909537150948:web:bceab862443b70def869f1",
};

const app = initializeApp(firebaseConfig);
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

export { app, auth };
