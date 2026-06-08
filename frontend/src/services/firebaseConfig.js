import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqDwi6eof850AQPaNU6B70snOva28BJvE",
  authDomain: "auth-class-06.firebaseapp.com",
  projectId: "auth-class-06",
  storageBucket: "auth-class-06.firebasestorage.app",
  messagingSenderId: "909537150948",
  appId: "1:909537150948:web:bceab862443b70def869f1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
