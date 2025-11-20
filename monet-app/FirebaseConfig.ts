// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import  ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsOIpxyq04g5cEWzKZUDziBwIhD32HZ6M",
  authDomain: "monet-app-af39c.firebaseapp.com",
  projectId: "monet-app-af39c",
  storageBucket: "monet-app-af39c.firebasestorage.app",
  messagingSenderId: "406608715050",
  appId: "1:406608715050:web:64503e6e7c8430547e5253",
  measurementId: "G-N9ZBQXD1KL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});