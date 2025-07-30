import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
  browserSessionPersistence,
  setPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Save score after game ends or at intervals
async function saveScore(user, score) {
  try {
    await addDoc(collection(db, "scores"), {
      uid: user.uid,
      email: user.email,
      score: score,
      timestamp: Date.now(),
    });
  } catch (e) {
    console.error("Error adding score: ", e);
  }
}

saveScore();
getTopScores();
getUserScores();

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCF8zpNR27NuNr_kcsDtMdOcmfvVX9ZGg",
  authDomain: "norwegian-english-app.firebaseapp.com",
  projectId: "norwegian-english-app",
  storageBucket: "norwegian-english-app.firebasestorage.app",
  messagingSenderId: "650793904999",
  appId: "1:650793904999:web:a3c33371d01c2aaf625dc2",
  measurementId: "G-V7J2YQPRW4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en"; // optional, but required for some Firebase features
auth.useDeviceLanguage(); // optional, but required for some Firebase features
const db = getFirestore(app);
const loginWindow = document.getElementById("loginWindow");

setPersistence(auth, browserSessionPersistence)
  .then(() => {})
  .catch((err) => {
    console.error("Persistence set error:", err);
  });

window.isLoggedIn = false;
onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    console.log("User is logged in:", user.email);
    loginWindow.style.display = "none";
    window.isLoggedIn = true;
  } else if (user && !user.emailVerified) {
    alert("Please verify your email before logging in.");
    signOut(auth);
    window.isLoggedIn = false;
  } else {
    loginWindow.style.display = "flex";
    window.isLoggedIn = false;
  }
});

document.getElementById("signup").onclick = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      console.log("Signed up:", userCredential.user);
      sendEmailVerification(userCredential.user)
        .then(() => alert("Verification email sent. Please check your inbox."))
        .catch((err) => alert("Email verification failed: " + err.message));
    })
    .catch((err) => alert("Signup error: " + err.message));
};

function loginUser() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, pass)
    .then((user) => console.log("Logged in:", user))
    .catch((err) => alert("Login error: " + err.message));
}

document.getElementById("login").onclick = loginUser;
document.querySelectorAll("#email, #password").forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      loginUser();
    }
  });
});

document.getElementById("logout").onclick = () => {
  if (
    confirm(
      "Are you sure you want to log out? All unsaved progress will be lost."
    )
  ) {
    if (typeof window.resetProgress === "function") {
      window.resetProgress();
    }
    document.getElementById("answer").value = "";
    signOut(auth)
      .then(() => console.log("Signed out"))
      .catch((err) => alert("Logout error: " + err.message));
  } else {
    console.log("Logout cancelled");
  }
};

async function getTopScores() {
  const scoresRef = collection(db, "scores");
  const q = query(scoresRef, orderBy("score", "desc"), limit(10));
  const snapshot = await getDocs(q);

  const leaderboard = [];
  snapshot.forEach((doc) => leaderboard.push(doc.data()));
  return leaderboard;
}

async function getUserScores(user) {
  const scoresRef = collection(db, "scores");
  const q = query(
    scoresRef,
    where("uid", "==", user.uid),
    orderBy("score", "desc"),
    limit(10)
  );
  const snapshot = await getDocs(q);

  const personalScores = [];
  snapshot.forEach((doc) => personalScores.push(doc.data()));
  return personalScores;
}
