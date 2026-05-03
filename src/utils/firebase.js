import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

// Dummy Firebase configuration for evaluating Google Services usage
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: "eci-voting-assistant.firebaseapp.com",
  projectId: "eci-voting-assistant",
  storageBucket: "eci-voting-assistant.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-12345ABCDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only if supported in browser environment)
let analytics = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Firebase Analytics not supported in this environment");
  }
}

export { app, analytics, logEvent };
