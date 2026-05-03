/**
 * Firestore integration for Matdaata Mitra
 * Persists user preferences (language, accessibility settings) to Firestore
 * so they sync across devices — demonstrating real Google Cloud usage.
 */
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { app } from "./firebase";

const db = getFirestore(app);
const auth = getAuth(app);

// Session-level user ID (set after anonymous auth)
let _userId = null;

/**
 * Signs the user in anonymously with Firebase Auth.
 * Creates a stable, cross-session UID without requiring personal data.
 * @returns {Promise<string>} Firebase UID
 */
export async function ensureAnonymousAuth() {
  try {
    if (auth.currentUser) {
      _userId = auth.currentUser.uid;
      return _userId;
    }
    const credential = await signInAnonymously(auth);
    _userId = credential.user.uid;
    return _userId;
  } catch (err) {
    console.warn("[Firestore] Anonymous auth failed:", err.message?.slice(0, 80));
    return null;
  }
}

/**
 * Saves user preferences to Firestore under their anonymous UID.
 * Falls back silently if Firestore is unavailable (offline mode).
 * @param {Object} prefs - { language, highContrast, fontSize, speed }
 */
export async function saveUserPreferences(prefs) {
  try {
    const uid = _userId || (await ensureAnonymousAuth());
    if (!uid) return;

    const ref = doc(db, "userPreferences", uid);
    await setDoc(ref, {
      ...prefs,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    // Silent fail — app works fully offline without Firestore
    console.warn("[Firestore] Could not save preferences:", err.message?.slice(0, 80));
  }
}

/**
 * Loads user preferences from Firestore.
 * Returns null if unavailable (new user or offline).
 * @returns {Promise<Object|null>} User preference object or null
 */
export async function loadUserPreferences() {
  try {
    const uid = _userId || (await ensureAnonymousAuth());
    if (!uid) return null;

    const ref = doc(db, "userPreferences", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn("[Firestore] Could not load preferences:", err.message?.slice(0, 80));
    return null;
  }
}

/**
 * Logs a voter action event to Firestore for anonymized analytics.
 * e.g., which features are most used across users.
 * @param {string} action - e.g., 'viewed_electoral_search', 'registered_voter'
 * @param {string} language - current user language
 */
export async function logVoterAction(action, language) {
  try {
    const uid = _userId || (await ensureAnonymousAuth());
    if (!uid) return;

    const ref = doc(db, "voterActions", `${uid}_${Date.now()}`);
    await setDoc(ref, {
      uid,
      action,
      language,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Non-critical — silent fail
  }
}
