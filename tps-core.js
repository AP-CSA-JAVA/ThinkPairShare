// Think-Pair-Share · shared Firebase setup and helpers
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth, signInAnonymously, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getDatabase, ref, onValue, set, update, remove, get, onDisconnect
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Only this Google account can run sessions (must match the database rules).
export const TEACHER_UID = "WGtBMyNFn3WWrELVUj8HYS57kJD3";

const firebaseConfig = {
  apiKey: "AIzaSyDlht7X2_SRvxS4XlaP7M3uqdHV4fK-2rU",
  authDomain: "thinkpairshare-46da3.firebaseapp.com",
  databaseURL: "https://thinkpairshare-46da3-default-rtdb.firebaseio.com",
  projectId: "thinkpairshare-46da3",
  storageBucket: "thinkpairshare-46da3.firebasestorage.app",
  messagingSenderId: "293704713912",
  appId: "1:293704713912:web:8924dc7f2817f4345ad64d"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

export {
  ref, onValue, set, update, remove, get, onDisconnect,
  signInAnonymously, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut
};

// Server-corrected clock so every screen shows the same timer.
let clockOffset = 0;
onValue(ref(db, ".info/serverTimeOffset"), s => { clockOffset = s.val() || 0; });
export const now = () => Date.now() + clockOffset;

// Reference inside a session: sRef("K7Q2", "meta/phase")
export const sRef = (code, path = "") => ref(db, `sessions/${code}${path ? "/" + path : ""}`);

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function fmtTime(ms) {
  const t = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

// Resolves with the saved signed-in user, or null if this browser has none yet.
export async function firstUser() {
  await auth.authStateReady();
  return auth.currentUser;
}

// Session codes skip look-alike characters (0/O, 1/I/L).
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function newCode() {
  let c = "";
  for (let i = 0; i < 4; i++) c += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return c;
}
export const normCode = s => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);

export const pageUrl = (file, code) => {
  const u = new URL(file, location.href);
  u.search = code ? `?s=${code}` : "";
  return u.href;
};

export const PHASES = ["lobby", "think", "pair", "share"];
export const PHASE_LABEL = { lobby: "Lobby", think: "Think", pair: "Pair", share: "Share", ended: "Ended" };
