// Firebase configuration placeholder
// Replace these values with your actual Firebase project config
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDjjw9N0vaT57-wi03fIWNY2SrFuh0-FzQ",
  authDomain: "java-quick-serve.firebaseapp.com",
  projectId: "java-quick-serve",
  storageBucket: "java-quick-serve.firebasestorage.app",
  messagingSenderId: "661138018522",
  appId: "1:661138018522:web:c78ef8263a0de5202fd5e3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;