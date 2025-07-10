// js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAD9NoOl4PUbNQXYAZrqSuXSVx_3dVUtu8",
  authDomain: "shared-notes-c08c6.firebaseapp.com",
  projectId: "shared-notes-c08c6",
  storageBucket: "shared-notes-c08c6.firebasestorage.app",
  messagingSenderId: "1074235682154",
  appId: "1:1074235682154:web:8cefacc22cdf248aa2c913"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
